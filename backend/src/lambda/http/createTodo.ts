import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodoItem } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  try {
    const result = await createTodoItem(newTodo);

    return {
      statusCode: 201,
      body: JSON.stringify(result)
    }
  } catch(error) {
    return {
      statusCode: 500,
      body: error.message
    }
  }
}
