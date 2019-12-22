import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodoItem } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  try {
    await deleteTodoItem(todoId);

    return {
      statusCode: 204,
      body: ""
    }
  } catch(error) {
    return {
      statusCode: 422,
      body: error.message
    }
  }
}
