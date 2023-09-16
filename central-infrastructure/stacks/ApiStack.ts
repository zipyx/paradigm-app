import { Api, StackContext, use } from "sst/constructs";
import { AuthStack } from "./AuthStack";
import { SNSStack } from "./SNSStack";

export function ApiStack({ stack }: StackContext) {
  // authenticate api using the auth resource
  const { auth } = use(AuthStack);
  const { topic } = use(SNSStack);

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
      function: {
        bind: [topic],
      },
    },

    // define routes
    routes: {
      // Private route
      "GET /private": "packages/functions/handlers/hApp/sample.main",

      // Public route
      "GET /public": {
        function: "packages/functions/handlers/services/sample.main",
        authorizer: "none",
      },

      // SNS route
      "POST /public/happ/connect": {
        function:
          "packages/functions/handlers/services/topic/publisher/hAppAgent.main",
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
