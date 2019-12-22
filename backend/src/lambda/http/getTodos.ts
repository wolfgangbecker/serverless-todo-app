import 'source-map-support/register'
import { getAllTodoItems } from "../../businessLogic/todos";

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    const result = await getAllTodoItems()

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch(error) {
    console.log("Error:", error.message)

    return {
      statusCode: 500,
      body: error.message
    }
  }
}
