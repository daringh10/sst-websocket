import { StackContext, Table, WebSocketApi } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Connections", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the WebSocket API
  const api = new WebSocketApi(stack, "Api", {
    defaults: {
      function: {
        // Bind our table to our API. 
        // It allows our API to access (read and write) the table we just created. 
        bind: [table], 
      },
    },
    routes: {
      $connect: "functions/connect.handler",
      $disconnect: "functions/disconnect.handler",
      sendmessage: "functions/sendMessage.handler",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });


}