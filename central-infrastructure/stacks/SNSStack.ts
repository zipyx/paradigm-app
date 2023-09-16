import { StackContext, Topic, use } from "sst/constructs";
import { DatabaseStack } from "./DatabaseStack";
import { SQSStack } from "./SQSStack";

export function SNSStack({ stack }: StackContext) {
  // use dynamo table from DatabaseStack
  const { hAppAgentServices } = use(DatabaseStack);
  const { patientRecordQueue, analyticsQueue, researchQueue } = use(SQSStack);

  // Create new topic for holochain services to subscribe and log to
  const topic = new Topic(stack, "HolochainAgentServices", {
    defaults: {
      function: {
        timeout: 30,
        environment: { tableName: hAppAgentServices.tableName },
        permissions: [hAppAgentServices],
        bind: [patientRecordQueue, analyticsQueue, researchQueue],
      },
    },
    subscribers: {
      holochainIntegratedServiceQueues:
        "packages/functions/handlers/services/topic/subscriber/hAppIntegratedServiceQueues.main",
    },
  });

  // Get output values
  stack.addOutputs({
    TopicId: topic.id,
    TopicName: topic.topicName,
    TopicSubscribers: topic.subscriptions.toString(),
  });

  return { topic };
}
