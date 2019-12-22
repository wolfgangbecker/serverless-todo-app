import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable: any = process.env.TODOS_TABLE
  ) {}

  async getAllTodoItems(): Promise<TodoItem[]> {
    console.log('Getting all groups');

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise();

    const items = result.Items;
    return items as TodoItem[];
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
