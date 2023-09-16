import AWS from "aws-sdk";
import { Queue } from "sst/node/queue";
import { SNSEvent } from "aws-lambda";

const sqs = new AWS.SQS();

export async function main(event: SNSEvent) {
  const records: any[] = event.Records;

  // Log message to use without queue services
  console.log(
    `(Topic) [Subscriber] Holochain App Agent Services : "${records[0].Sns.Message}"`,
  );

  // Send data to patient db queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.PatientRecordQueue.queueUrl,
      MessageBody: JSON.stringify({ data: records[0].Sns.Message }),
    })
    .promise();

  console.log("(Queue|Producer) [Patient Db] Message queued!");

  // send data to analytics queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.AnalyticsQueue.queueUrl,
      MessageBody: JSON.stringify({ data: records[0].Sns.Message }),
    })
    .promise();

  console.log("(Queue|Producer) [Analytics] Message queued!");

  // send data to health research queue
  await sqs
    .sendMessage({
      // Get the queue url from the environment variable
      QueueUrl: Queue.ResearchQueue.queueUrl,
      MessageBody: JSON.stringify({ data: records[0].Sns.Message }),
    })
    .promise();

  console.log("(Queue|Producer) [Health Research] Message queued!");

  // Log all services
  console.log(
    "(Queue|Producer) [All] Messages for integrated services queued!",
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
