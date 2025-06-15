import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const todoList = async ({ pageParam, type }: { pageParam?: string | null; type: string }) => {
  const params = new URLSearchParams({
    limit: "5",
    ...(type && { type }),
    ...(pageParam && { lastJobId: pageParam }),
  });

  const { data } = await axios.get(`${baseURL}/todos`, { params });
  return data;
};

export const useTodoInfiniteFetch = (type: string) => {
  return useInfiniteQuery({
    queryKey: ["todoList", type],
    queryFn: ({ pageParam }) => todoList({ pageParam, type }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const lastTodo = lastPage.todos?.at(-1);
      return lastPage.hasMore && lastTodo ? lastTodo._id : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
