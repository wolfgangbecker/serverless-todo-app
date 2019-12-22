import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem';
import { TodosAccess } from '../dataLayer/todosAccess';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const groupAccess = new TodosAccess()

export async function getAllTodoItems(): Promise<TodoItem[]> {
  return groupAccess.getAllTodoItems()
}

export async function createTodoItem(createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
  const todoId = uuid.v4()

  return await groupAccess.createTodoItem({
    userId: "Add user id", // TODO: extract from jwt
    todoId,
    createdAt: new Date().toISOString().substring(0, 10),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}
