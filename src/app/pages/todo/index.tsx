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
      <Box className={styles["todo-form"]}>
        <TodoForm initialData={selectedTodo} onClear={() => setSelectedTodo(null)} />
      </Box>

      <Box className={styles["todo-list"]}>
        <TodoList onEdit={setSelectedTodo} />
      </Box>
    </Box>
  );
};
