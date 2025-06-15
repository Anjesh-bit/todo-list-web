export interface DateStatus {
  isExpired: boolean;
  formatted: string;
  timestamp: Date;
}

/**
 * Evaluates a date string for expiration and formats it for display.
 * @param input - ISO or string date
 * @returns {DateStatus} Object with expiration status, formatted string, and parsed timestamp
 */

export const evaluateDateStatus = (input: Date): DateStatus => {
  const now = new Date();
  const timestamp = new Date(input);
  const isExpired = timestamp < now;
  const formatted = timestamp.toLocaleString();

  return {
    isExpired,
    formatted,
    timestamp,
  };
};
