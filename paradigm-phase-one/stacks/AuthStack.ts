import { Cognito, StackContext } from "sst/constructs";

export function AuthStack({ stack, app }: StackContext) {
  // Create a cognito user pool and identity pool
  const auth = new Cognito(stack, "Cognito", {
    login: ["email"],
  });

  // display output
  stack.addOutputs({
    region: app.region,
    appStage: app.stage,
    userPoolId: auth.userPoolId,
    userPoolArn: auth.userPoolArn,
    userPoolClientId: auth.userPoolClientId,
    cognitoIdentityPoolId: auth.cognitoIdentityPoolId,
  });

  // Share resource
  return { auth };
}
