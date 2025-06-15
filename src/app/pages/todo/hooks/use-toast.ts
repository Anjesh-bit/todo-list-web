import { useState, useEffect, useCallback } from "react";

export const useToast = (duration = 2000) => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return { message, showToast };
};
