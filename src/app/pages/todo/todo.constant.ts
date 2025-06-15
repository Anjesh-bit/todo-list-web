export enum TodoStatus {
  DONE = "done",
  UPCOMING = "upcoming",
}

export const QUERY_KEY = ["todoList"];

export const todoFiltrationOptions = [
  { label: "All Todos", value: "" },
  { label: "Upcoming Todos", value: TodoStatus.UPCOMING },
  { label: "Completed Todos", value: TodoStatus.DONE },
];
