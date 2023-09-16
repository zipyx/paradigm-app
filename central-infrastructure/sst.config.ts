import { SSTConfig } from "sst";
import { SQSStack } from "./stacks/SQSStack";
import { ApiStack } from "./stacks/ApiStack";
import { SNSStack } from "./stacks/SNSStack";
import { AuthStack } from "./stacks/AuthStack";
import { StorageStack } from "./stacks/StorageStack";
import { DatabaseStack } from "./stacks/DatabaseStack";
import { WebSocketApiStack } from "./stacks/WebSocketApiStack";

export default {
  config(_input) {
    return {
      name: "central-infrastructure",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    const prototype = `${app.name}-${app.stage}`;
    app.setDefaultFunctionProps({
      runtime: "nodejs18.x",
      logRetention: "six_months",
    });
    app
      .stack(AuthStack, { stackName: `auth-${prototype}` })
      .stack(SQSStack, { stackName: `sqs-queue-${prototype}` })
      .stack(DatabaseStack, { stackName: `database-${prototype}` })
      .stack(SNSStack, { stackName: `sns-${prototype}` })
      .stack(ApiStack, { stackName: `api-${prototype}` })
      .stack(StorageStack, { stackName: `storage-${prototype}` })
      .stack(WebSocketApiStack, { stackName: `websocketapi-${prototype}` });
  },
} satisfies SSTConfig;
