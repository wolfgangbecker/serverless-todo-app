import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodosAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const groupAccess = new TodosAccess()

export async function getAllTodoItems(userId: string): Promise<TodoItem[]> {
  return groupAccess.getAllTodoItems(userId)
}

export async function createTodoItem(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await groupAccess.createTodoItem({
    userId,
    todoId,
    createdAt: new Date().toISOString().substring(0, 10),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodoItem(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
  return await groupAccess.updateTodoItem(userId, todoId, updateTodoRequest);
}

export async function deleteTodoItem(userId: string, todoId: string): Promise<void> {
  return await groupAccess.deleteTodoItem(userId, todoId);
}

export async function generateUploadUrl(userId: string, todoId: string): string {
  await groupAccess.addImageUrl(userId, todoId);

  return groupAccess.generateUploadUrl(todoId);
}
