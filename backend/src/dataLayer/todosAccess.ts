import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable: any = process.env.TODOS_TABLE
  ) {}

  async getAllTodoItems(): Promise<TodoItem[]> {
    console.log('Getting all todos');

    const result = await this.docClient.scan({
      TableName: this.todosTable
    }).promise();

    const items = result.Items;
    return items as TodoItem[];
  }

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    console.log('Creating todo:', todoItem.todoId);

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise();

    return todoItem;
  }

  async updateTodoItem(todoId: string, todoUpdate: TodoUpdate): Promise<TodoItem> {
    console.log('Updating todo:', todoId);

    const result = await this.docClient.update({
      TableName: this.todosTable,
      Key: { todoId },
      UpdateExpression: "set #name = :name, dueDate=:dueDate, done=:done",
      ExpressionAttributeValues: {
          ":name": todoUpdate.name,
          ":dueDate": todoUpdate.dueDate,
          ":done": todoUpdate.done
      },
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ReturnValues:"ALL_NEW"
    }).promise();

    return result.Attributes as TodoItem;
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
