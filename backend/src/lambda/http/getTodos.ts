import 'source-map-support/register'
import * as AWS from 'aws-sdk';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const docClient = createDynamoDBClient();

  try{
    const result = await docClient.scan({
      TableName: process.env.TODOS_TABLE
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    }
  } catch {
    console.log("Error")

    return {
      statusCode: 404,
      body: "string"
    }
  }
}

function createDynamoDBClient() {
  if(process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
