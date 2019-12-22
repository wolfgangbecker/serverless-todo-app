import { TodoItem } from '../models/TodoItem';
import { TodosAccess } from '../dataLayer/todosAccess';

const groupAccess = new TodosAccess()

export async function getAllTodoItems(): Promise<TodoItem[]> {
  return groupAccess.getAllTodoItems()
}
