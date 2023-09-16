import { APIGatewayProxyHandlerV2WithJWTAuthorizer } from "aws-lambda";

export const main: APIGatewayProxyHandlerV2WithJWTAuthorizer = async (
  event,
) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello from Holochain!",
        input: event,
      },
      null,
      2,
    ),
  };
};
