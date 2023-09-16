import { Cognito, StackContext } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext) {
  // Create a cognito user pool and identity pool
  const auth = new Cognito(stack, "Cognito", {
    login: ["email"],
  });

  // display output
  stack.addOutputs({
    Region: app.region,
    AppStage: app.stage,
    UserPoolId: auth.userPoolId,
    UserPoolArn: auth.userPoolArn,
    UserPoolClientId: auth.userPoolClientId,
    CognitoIdentityPoolId: auth.cognitoIdentityPoolId,
  });

  // Share resource
  return { auth };
}
