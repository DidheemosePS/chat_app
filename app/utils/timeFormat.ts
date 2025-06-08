// Function to convert timestamps to DD/MM/YYYY
export function timeFormat(timestampMs: number) {
  const date = new Date(timestampMs);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isToday = isSameDay(date, now);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = isSameDay(date, yesterday);

  // Week starts on Monday
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay() || 7; // Treat Sunday as 7
  startOfWeek.setDate(now.getDate() - day + 1);
  startOfWeek.setHours(0, 0, 0, 0);

  const isThisWeek = date >= startOfWeek;

  if (isToday) {
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // "14:05"
  } else if (isYesterday) {
    return "Yesterday";
  } else if (isThisWeek) {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
    }); // "Monday"
  } else {
    return date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }); // "06/10/2024"
  }
}

// Function to convert timestamp to 21:30
export function timeOnly(timestamp: number | string) {
  if (!timestamp) return "";

  const date = new Date(Number(timestamp));

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}
