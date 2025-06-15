import { Box } from "@mantine/core";
import { useState } from "react";

import { TodoForm } from "./components/form/form";
import { TodoList } from "./components/list/list";
import styles from "./todo.module.css";
import { Todo } from "./todo.types";

export const TodoPage = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  return (
    <Box className={styles["todo-wrapper"]}>
      <TodoForm initialData={selectedTodo} onClear={() => setSelectedTodo(null)} />
      <TodoList onEdit={setSelectedTodo} />
    </Box>
  );
};
