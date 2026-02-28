// src/utils/timeFun.js

const parseDateInput = (input) => {
  if (!input) return null;
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }
  if (typeof input === "number") {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input !== "string") return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const direct = new Date(trimmed);
  if (!isNaN(direct.getTime())) return direct;

  const match = trimmed.match(
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[ ,T](\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?/i
  );
  if (!match) return null;

  let part1 = parseInt(match[1], 10);
  let part2 = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  let hour = parseInt(match[4] || "0", 10);
  const minute = parseInt(match[5] || "0", 10);
  const second = parseInt(match[6] || "0", 10);
  const ampm = match[7];

  if (ampm) {
    const upper = ampm.toUpperCase();
    if (upper === "PM" && hour < 12) hour += 12;
    if (upper === "AM" && hour === 12) hour = 0;
  }

  // Prefer day-month when ambiguous to support dd/mm locale strings.
  let day = part1;
  let month = part2;
  if (part1 <= 12 && part2 > 12) {
    month = part1;
    day = part2;
  } else if (part1 > 12 && part2 <= 12) {
    day = part1;
    month = part2;
  }

  const parsed = new Date(year, month - 1, day, hour, minute, second);
  return isNaN(parsed.getTime()) ? null : parsed;
};

const timeFun = (inputTime) => {
  const parsed = parseDateInput(inputTime);
  if (!parsed) return "Just now";

  const time = parsed.getTime();
  const now = Date.now();

  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 10) return "Just now";
  if (diffInSeconds < 60)
    return `${diffInSeconds} sec${diffInSeconds > 1 ? "s" : ""} ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} min${diffInMinutes > 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hr${diffInHours > 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
};

export default timeFun;
