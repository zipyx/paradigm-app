import { WebSocketApi, StackContext, use } from "sst/constructs";
import { DatabaseStack } from "./DatabaseStack";
import { SNSStack } from "./SNSStack";

export function WebSocketApiStack({ stack }: StackContext) {
  // use dynamo table from DatabaseStack
  const { hAppAgentConnections } = use(DatabaseStack);
  const { topic } = use(SNSStack);

  // build API
  const api = new WebSocketApi(stack, "Api", {
    defaults: {
      function: {
        timeout: 20,
        logRetention: "six_months",
        bind: [
          topic, // allow messages from agents to be published to sns topic
          hAppAgentConnections, // register holochain app agent connections
        ],
      },
    },

    // define routes for the holochain agents to connect to
    routes: {
      $default: "packages/functions/handlers/hApp/websocket/default.main",
      $connect: "packages/functions/handlers/hApp/websocket/connect.main",
      $disconnect: "packages/functions/handlers/hApp/websocket/disconnect.main",
      sendmessage:
        "packages/functions/handlers/hApp/websocket/sendMessage.main",
    },
  });

  // Get output values
  stack.addOutputs({
    WebSocketApiId: api.id,
    WebSocketApiEndpoint: api.url,
    WebSocketApiAvailableRoutes: api.routes.toString(),
  });
}
