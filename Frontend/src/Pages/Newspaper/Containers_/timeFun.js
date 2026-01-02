// src/utils/timeFun.js

const timeFun = (inputTime) => {
  if (!inputTime) return "Just now";

  const time = new Date(inputTime).getTime();
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
