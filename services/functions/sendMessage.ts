import { DynamoDB, ApiGatewayManagementApi } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";
import { APIGatewayProxyHandler } from "aws-lambda";

const TableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event) => {
    // We first JSON decode our message body.
  const messageData = JSON.parse(event.body).data;
  const { stage, domainName } = event.requestContext;

  // Then we grab all the connection ids from our table.
  const connections = await dynamoDb
    .scan({ TableName, ProjectionExpression: "id" })
    .promise();

  const apiG = new ApiGatewayManagementApi({
    endpoint: `${domainName}/${stage}`,
  });

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

  // We iterate through all the ids and use the postToConnection method of 
  // the AWS.ApiGatewayManagementApi class to send out our message.
  await Promise.all(connections.Items.map(postToConnection));

  return { statusCode: 200, body: "Message sent" };
};