import AWS from "aws-sdk";
import { Queue } from "sst/node/queue";

const sqs = new AWS.SQS();

export async function main() {
  // Send data to patient db queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.PatientDbQueue.queueUrl,
      MessageBody: JSON.stringify({ ordered: true }),
    })
    .promise();

  console.log("(Producer) [Patient Db] Message queued!");

  // send data to analytics queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.AnalyticsQueue.queueUrl,
      MessageBody: JSON.stringify({ ordered: true }),
    })
    .promise();

  console.log("(Producer) [Analytics] Message queued!");

  // send data to health research queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.HealthResearchQueue.queueUrl,
      MessageBody: JSON.stringify({ ordered: true }),
    })
    .promise();

  console.log("(Producer) [Health Research] Message queued!");

  // Log all services
  console.log("(Producer) [All] Messages for integrated services queued!");

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
