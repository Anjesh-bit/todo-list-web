import { InfiniteData, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../../../lib/axios/axios";
import { ToggleDoneInput, UpsertTodoInput, UpsertTodoResponse, ToggleDoneResponse, Todo } from "../todo.types";
const baseURL = import.meta.env.VITE_API_BASE_URL;

type TodoInfiniteListType = { todos: Todo[]; hasMore: boolean };

const upsertTodo = async ({ id, payload }: UpsertTodoInput): Promise<UpsertTodoResponse> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const url = id ? `${baseURL}/todos/${id}` : `${baseURL}/todos`;
    const method = id ? "put" : "post";
    const response = await axiosInstance[method]<UpsertTodoResponse>(url, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (id: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`${baseURL}/todos/${id}`);
  return response.data;
};

export const useTodoDelete = (type: string = ""): UseMutationResult<{ message: string }, unknown, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList", type] });
    },
  });
};

export const useTodoUpsert = (): UseMutationResult<UpsertTodoResponse, unknown, UpsertTodoInput> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todoList"] });
    },
  });
};

const toggleTodoDone = async ({ id }: ToggleDoneInput): Promise<ToggleDoneResponse> => {
  const response = await axiosInstance.patch<ToggleDoneResponse>(`${baseURL}/todos/${id}/done`);
  return response.data;
};

/**
 * Optimistic update implementation for toggling the 'done' status of a todo item.
 *
 * This approach updates the UI immediately to provide a responsive user experience,
 * assuming the server operation will succeed. If the server request fails,
 * the update is rolled back to maintain data consistency.
 */

export const useTodoToggleDone = (
  type: string = ""
): UseMutationResult<ToggleDoneResponse, unknown, ToggleDoneInput> => {
  const queryClient = useQueryClient();
  const queryKey = ["todoList", type];

  return useMutation({
    mutationFn: toggleTodoDone,

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<InfiniteData<TodoInfiniteListType>>(queryKey);

      queryClient.setQueryData<InfiniteData<TodoInfiniteListType>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            todos: page.todos.map((todo: Todo) => (todo._id === id ? { ...todo, done: !todo.done } : todo)),
          })),
        };
      });

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },

    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<TodoInfiniteListType>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            todos: page.todos.map((todo: Todo) => (todo._id === data.updatedTodo._id ? data.updatedTodo : todo)),
          })),
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
