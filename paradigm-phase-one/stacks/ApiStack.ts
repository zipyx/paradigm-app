import { Api, StackContext, use } from "sst/constructs";
import { AuthStack } from "./AuthStack";

export function ApiStack({ stack, app }: StackContext) {
  // authenticate api using the auth resource
  const { auth } = use(AuthStack);

  // build API
  const api = new Api(stack, "Api", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },

    // set default to jwt
    defaults: {
      authorizer: "jwt",
    },

    // define routes
    routes: {
      "GET /private": "functions/holochain/sample.handler",
      "GET /public": {
        function: "functions/server/sample.handler",
        authorizer: "none",
      },
    },
  });

  // Get output values
  stack.addOutputs({
    ApiId: api.id,
    ApiEndpoint: api.url,
    ApiAvailableRoutes: api.routes.toString(),
  });
}
