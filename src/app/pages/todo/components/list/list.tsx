import { Box, Loader, Text, SegmentedControl, Switch, ActionIcon, Tooltip } from "@mantine/core";
import debounce from "lodash.debounce";
import React, { useRef, useEffect, useCallback, useMemo } from "react";

import styles from "./list.module.css";
import { evaluateDateStatus } from "./list.utils";
import { ReactComponent as DeleteIcon } from "../../../../../assets/static/icons/delete.svg";
import { ReactComponent as EditIcon } from "../../../../../assets/static/icons/edit.svg";
import { useToast } from "../../hooks/use-toast";
import { useTodoInfiniteFetch } from "../../services/use-todo-fetch.services";
import { useTodoDelete, useTodoToggleDone } from "../../services/use-todo-mutate.services";
import { todoFiltrationOptions } from "../../todo.constant";
import { Todo } from "../../todo.types";

type TodoListProps = {
  onEdit: (todo: Todo) => void;
};

export const TodoList = ({ onEdit }: TodoListProps) => {
  const [filterType, setFilterType] = React.useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useTodoInfiniteFetch(filterType);

  const { mutate: toggleDone } = useTodoToggleDone(filterType);
  const { mutate: deleteTodo } = useTodoDelete(filterType);
  const { message: toastMessage, showToast } = useToast();

  const todos = useMemo(() => {
    return data?.pages.flatMap((page) => page.todos) || [];
  }, [data]);

  const handleToggle = (id: string) => () => {
    toggleDone({ id });
  };

  const handleDelete = (id: string) => () => {
    if (confirm("Are you sure you want to delete this todo?"))
      deleteTodo(id, {
        onSuccess: (response) => {
          if (response?.message) showToast(response.message);
        },
      });
  };

  const debouncedFetchNext = useCallback(() => {
    const handler = debounce(() => {
      if (hasNextPage) {
        fetchNextPage();
      }
    }, 300);
    handler();
  }, [fetchNextPage, hasNextPage]);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && !isFetchingNextPage) {
        debouncedFetchNext();
      }
    },
    [debouncedFetchNext, isFetchingNextPage]
  );

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 1,
    });

    observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  }, [observerCallback]);

  if (isLoading) {
    return (
      <Box className={styles["loading-indicator"]}>
        <Loader color="violet" size="xl" />
      </Box>
    );
  }

  return (
    <Box style={{ position: "relative" }}>
      <SegmentedControl
        classNames={{ root: styles["sticky"] }}
        fullWidth
        size="md"
        radius="md"
        color="violet"
        data={todoFiltrationOptions}
        value={filterType}
        onChange={setFilterType}
        mb="lg"
      />
      {toastMessage && <div className={styles["toast"]}>{toastMessage}</div>}
      <Box className={styles["todo-list"]}>
        {todos.map(({ _id, name, description, date, done }) => {
          const { isExpired, formatted } = evaluateDateStatus(date);
          return (
            <Box key={_id} className={`${styles["todo-item"]} ${done ? styles["done"] : ""}`}>
              <Box className={styles["todo-header"]}>
                <Text className={styles["todo-name"]}>{name}</Text>
                <Box className={styles["todo-actions"]}>
                  <Tooltip label="Edit">
                    <ActionIcon
                      variant="light"
                      color="violet"
                      onClick={() => onEdit({ _id, name, description, date, done })}
                    >
                      <EditIcon width={18} height={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon variant="light" color="red" onClick={handleDelete(_id)}>
                      <DeleteIcon width={18} height={18} />
                    </ActionIcon>
                  </Tooltip>
                </Box>
              </Box>

              <Text className={styles["todo-description"]}>{description}</Text>
              <Text className={styles["todo-date"]}>{formatted}</Text>
              <Text className={done ? styles["todo-status-done"] : styles["todo-status-pending"]}>
                {done ? "Completed" : "Pending"}
              </Text>
              <Switch
                mt="sm"
                color="violet"
                size="md"
                checked={done}
                disabled={isExpired}
                onChange={handleToggle(_id)}
                label={isExpired ? "Expired" : "Mark as Done"}
              />
            </Box>
          );
        })}

        <div ref={loadMoreRef} />

        {isFetchingNextPage && (
          <Box mt="md" className={styles["loading-indicator"]}>
            <Loader color="violet" size="sm" />
          </Box>
        )}

        {!hasNextPage && (
          <Text ta="center" mt="md">
            No more todos
          </Text>
        )}
      </Box>
    </Box>
  );
};
