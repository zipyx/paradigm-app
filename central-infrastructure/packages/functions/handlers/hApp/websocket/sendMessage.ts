import AWS from "aws-sdk";
import { Topic } from "sst/node/topic";
import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "sst/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";

const sns = new AWS.SNS();
const TableName = Table["hApp-agent-connections"].tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const messageData = JSON.parse(event.body).data;
  const { stage, domainName } = event.requestContext;

  // Get all the connections
  const connections = await dynamoDb
    .scan({ TableName, ProjectionExpression: "id" })
    .promise();

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

  // Publish a message to holochain services topic
  await sns
    .publish({
      // Get the topic from the environment variable
      TopicArn: Topic.HolochainAgentServices.topicArn,
      Message: JSON.stringify({ data: messageData }),
      MessageStructure: "string",
    })
    .promise();

  console.log(
    "(WebsocketAPI|Topic) [Publisher] message from websocket data sent!",
  );

  const postToConnection = async function ({ id }) {
    try {
      // Send the message to the given client
      await apiG
        .postToConnection({ ConnectionId: id, Data: messageData })
        .promise();
    } catch (e) {
      if (e.statusCode === 410) {
        // Remove stale connections
        await dynamoDb.delete({ TableName, Key: { id } }).promise();
      }
    }
  };

  // Iterate through all the connections
  await Promise.all(connections.Items.map(postToConnection));

  return { statusCode: 200, body: "Message sent" };
};
