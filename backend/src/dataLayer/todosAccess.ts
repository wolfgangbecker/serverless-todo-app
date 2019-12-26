import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { integer } from 'aws-sdk/clients/cloudfront';

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable: string = process.env.TODOS_TABLE,
    private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration: integer = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)

  ) {}

  async getAllTodoItems(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos');

    const result = await this.docClient.query({
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
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

  async updateTodoItem(userId: string, todoId: string, todoUpdate: TodoUpdate): Promise<TodoItem> {
    console.log('Updating todo:', todoId);

    const result = await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
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

  async deleteTodoItem(userId: string, todoId: string): Promise<void> {
    console.log('Deleting todo:', todoId);

    await this.docClient.delete({
      TableName: this.todosTable,
      Key: { userId, todoId },
    }).promise();
  }

  generateUploadUrl(todoId: string): string {
    return s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    });
  }

  async addImageUrl(userId: string, todoId: string): Promise<TodoItem> {
    console.log("Adding image URL to todo: ", todoId);

    const url = `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;

    const result = await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: "set #attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": url
      },
      ExpressionAttributeNames: {
        "#attachmentUrl": "attachmentUrl"
      },
      ReturnValues:"ALL_NEW"
    }).promise();

    return result.Attributes as TodoItem;
  }
}

function createDynamoDBClient() {
  if(process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
