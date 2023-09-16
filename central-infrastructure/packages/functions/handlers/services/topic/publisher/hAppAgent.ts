import AWS from "aws-sdk";
import { Topic } from "sst/node/topic";

const sns = new AWS.SNS();

export async function main() {
  // Publish a message to topic
  await sns
    .publish({
      // Get the topic from the environment variable
      TopicArn: Topic.HolochainAgentServices.topicArn,
      Message: JSON.stringify({ ordered: true }),
      MessageStructure: "string",
    })
    .promise();

  console.log("(Topic) [Publisher] Order confirmed!");

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}
