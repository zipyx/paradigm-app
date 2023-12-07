import { axios } from 'axios';
import { util } from 'util';
import { jsonwebtoken } from 'jsonwebtoken';
import { jwkToPem } from 'jwk-to-pem';

// import { WebSocketApiHandler } from 'sst/node/websocket-api';
// import { Session, useSession } from 'sst/node/auth';

// export const handler = WebSocketApiHandler(async () => {

//   const jwt = Session.create({
//     type: "user",
//     properties: {
//       userID: user.userID,
//     }
//   })

//   const session = useSession();
//   if (session.type === 'public') {
//     return { statusCode: 401};
//   }
//   // Do something here...
//   return {
//     statusCode: 200,
//   };
// });
const tokenPrefix = "Bearer ";
const tokenUse = "id";
const groupHolochain = "holochain_user_agents";

export const main = function (event, context, callback) {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // A simple REQUEST authorizer example to demonstrate how to use request
    // parameters to allow or deny a request. In this example, a request is
    // authorized if the client-supplied HeaderAuth1 header and QueryString1 query parameter
    // in the request context match the specified values of
    // of 'headerValue1' and 'queryValue1' respectively.

    // Retrieve request parameters from the Lambda function input:
    var headers = event.headers;
    var queryStringParameters = event.queryStringParameters;
    var stageVariables = event.stageVariables;
    var requestContext = event.requestContext;

    // Parse the input for the parameter values
    var tmp = event.methodArn.split(":");
    var apiGatewayArnTmp = tmp[5].split("/");
    var awsAccountId = tmp[4];
    var region = tmp[3];
    var ApiId = apiGatewayArnTmp[0];
    var stage = apiGatewayArnTmp[1];
    var route = apiGatewayArnTmp[2];
    
    // Custom additions
    const domain = event.requestContext.domainName;
    console.log(`Domain: ${domain}`);
    // const stage = event.requestContext.stage;
    const connectionId = event.requestContext.connectionId;
    console.log(`Connection ID: ${connectionId}`);
    const callbackUrl = `https://${domain}/${stage}`;
    console.log(`Callback URL: ${callbackUrl}`);

    // Perform authorization to return the Allow policy for correct parameters and
    // the 'Unauthorized' error, otherwise.
    var authResponse = {};
    var condition = {};
    condition.IpAddress = {};

    console.log(`First one here`)
    if (
        headers.HeaderAuth1 === "headerValue1" &&
            queryStringParameters.QueryString1 === "queryValue1"
    ) {
        console.log(`Second one here`);
        callback(null, generateAllow("me", event.methodArn));
    } else {
        console.log(`You are unauthorized.`)
        // callback("Unauthorized");
        callback(null, generateDeny("me", event.methodArn));
    }
};

// Helper function to generate an IAM policy
var generatePolicy = function (principalId, effect, resource) {
    // Required output:
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = "2012-10-17"; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = "execute-api:Invoke"; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    // Optional output with custom properties of the String, Number or Boolean type.
    authResponse.context = {
        stringKey: "stringval",
        numberKey: 123,
        booleanKey: true,
    };
    return authResponse;
};

var generateAllow = function (principalId, resource) {
    return generatePolicy(principalId, "Allow", resource);
};

var generateDeny = function (principalId, resource) {
    return generatePolicy(principalId, "Deny", resource);
};

let cachedJwks;
var getJwks = function (region, userPoolId) {
  if (!cachedJwks) {
    console.log("Cache miss: JWKS");
    const uri = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const response = await axios.get(uri);
    cachedJwks = response.data.keys;
    return cachedJwks;
  }
  console.log("Cache hit: JWKS");
  return cachedJwks;

}

const validateJwt = util.promisify(jsonwebtoken.verify.bind(jsonwebtoken));

var verifyClaim(region, userPoolId, clientId, token) {
  try {
    // Reference: Verifying a JSON web token
    // https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html

    // Step 1: Confirm the structure of the JWT
    const header = token.split(".")[0];
    const { kid } = JSON.parse(Buffer.from(header, "base64").toString("utf-8"));

    // Step 2: Validate the JWT signature
    const jwks = await getJwks(region, userPoolId);
    const jwk = jwks.find((key) => key.kid === kid);
    const pem = jwkToPem(jwk);
    const claim = await validateJwt(token, pem, { algorithms: ["RS256"] });

    // Step 3: Verify the claims

    // 1. Verify that the token is not expired.
    const now = Math.floor(new Date().valueOf() / 1000);
    if (now > claim.exp || now < claim.auth_time) {
      throw new Error(`Claim expired or invalid`);
    }

    // 2. The audience (aud) claim should match the app client ID that
    // was created in the Amazon Cognito user pool.
    const audience = clientId;
    if (claim.aud !== audience) {
      throw new Error(`Invalid claim audience: ${claim.aud}`);
    }

    // 3. The issuer (iss) claim should match your user pool. For
    // example, a user pool created in the us-east-1 Region will have
    // the following iss value:
    // https://cognito-idp.us-east-1.amazonaws.com/<userpoolID>.
    const issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    if (claim.iss !== issuer) {
      throw new Error(`Invalid claim issuer: ${claim.iss}`);
    }

    // 4. Check the token_use claim.
    if (claim.token_use !== tokenUse) {
      throw new Error(`Invalid token use: ${claim.token_use}`);
    }

    return { claim, error: null };
  } catch (error) {
    return { claim: null, error };
  }
}
