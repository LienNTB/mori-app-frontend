export function getTimeElapsed(createdAtString) {
  const createdAt = new Date(createdAtString);
  const now = new Date();
  const createdAtDate = new Date(createdAt);

  const elapsedMillis = now - createdAtDate;
  const elapsedSeconds = Math.floor(elapsedMillis / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedMonths / 12);

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} giây trước`;
  }

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} phút trước`;
  }

  if (elapsedHours < 24) {
    return `${elapsedHours} giờ trước`;
  }

  if (elapsedDays < 30) {
    return `${elapsedDays} ngày trước`;
  }

  if (elapsedMonths < 12) {
    return `${elapsedMonths} tháng trước`;
  }

  return `${elapsedYears} năm trước`;
}
export function convertMongoDBTimeToHourMinDate(mongoTime) {
  const dateObj = new Date(mongoTime);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const date = dateObj.toDateString();

  return `${hours}:${minutes}, ${date}`;
}
