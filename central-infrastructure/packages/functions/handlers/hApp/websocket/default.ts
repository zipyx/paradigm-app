import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { Table } from "sst/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const params = {
    // TableName: Table.Connections.tableName,
    TableName: Table["hApp-agent-connections"].tableName,
    Item: {
      id: event.requestContext.connectionId,
      connected_at: event.requestContext.connectedAt,
      ip_address: event.requestContext.identity.sourceIp,
      message: event.body,
    },
  };

  await dynamoDb.put(params).promise();

  return { statusCode: 200, body: "Connected, default websocket response" };
};
