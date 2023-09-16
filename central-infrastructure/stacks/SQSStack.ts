import { StackContext, Queue } from "sst/constructs";

export function SQSStack({ stack }: StackContext) {
  // Patient Db Queue to consume holochain agent data sharing
  const patientRecordQueue = new Queue(stack, "PatientRecordQueue", {
    consumer:
      "packages/functions/handlers/services/queue/consumer/patientRecord.main",
  });

  // Analytics queue
  const analyticsQueue = new Queue(stack, "AnalyticsQueue", {
    consumer:
      "packages/functions/handlers/services/queue/consumer/analytics.main",
  });

  // Health research queue
  const researchQueue = new Queue(stack, "ResearchQueue", {
    consumer:
      "packages/functions/handlers/services/queue/consumer/research.main",
  });

  // Get output values
  stack.addOutputs({
    PatientDbQueueId: patientRecordQueue.id,
    PatientDbQueueName: patientRecordQueue.queueName,
    PatientDbQueueUrl: patientRecordQueue.queueUrl,
    AnalyticsQueueId: analyticsQueue.id,
    AnalyticsQueueName: analyticsQueue.queueName,
    AnalyticsQueueUrl: analyticsQueue.queueUrl,
    HealthResearchQueueId: researchQueue.id,
    HealthResearchQueueName: researchQueue.queueName,
    HealthResearchQueueUrl: researchQueue.queueUrl,
  });

  return { patientRecordQueue, analyticsQueue, researchQueue };
}
