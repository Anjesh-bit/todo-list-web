export type BaseTodo = {
  name: string;
  description: string;
  date: Date;
};

export type Todo = BaseTodo & {
  _id: string;
  done: boolean;
};

export type UpsertTodoInput = {
  id?: string;
  payload: BaseTodo;
};

export type UpsertTodoResponse = {
  todo: Todo;
  message?: string;
};

export type ToggleDoneInput = {
  id: string;
};

export type ToggleDoneResponse = {
  success: boolean;
  updatedTodo: Todo;
};

export type TodoListProps = {
  todos: Todo[];
};
