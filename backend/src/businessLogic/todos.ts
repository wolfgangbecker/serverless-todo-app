import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodosAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const groupAccess = new TodosAccess()

export async function getAllTodoItems(): Promise<TodoItem[]> {
  return groupAccess.getAllTodoItems("1") // TODO: extract from jwt
}

export async function createTodoItem(createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await groupAccess.createTodoItem({
    userId: "1", // TODO: extract from jwt
    todoId,
    createdAt: new Date().toISOString().substring(0, 10),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function updateTodoItem(todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
  return await groupAccess.updateTodoItem("1", todoId, updateTodoRequest);
}

export async function deleteTodoItem(todoId: string): Promise<void> {
  return await groupAccess.deleteTodoItem("1", todoId);
}

export function generateUploadUrl(todoId: string): string {
  return groupAccess.generateUploadUrl(todoId);
}
