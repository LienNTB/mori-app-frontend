export function getTimeElapsed(createdAtString) {
  const createdAt = new Date(createdAtString);
  const now = new Date();
  const createdAtDate = new Date(createdAt);

  const elapsedMillis = now - createdAtDate;
  const elapsedSeconds = Math.floor(elapsedMillis / 1000);

  if (elapsedSeconds < 60) {
    return `${elapsedSeconds} giây trước`;
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} phút trước`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  return `${elapsedHours} giờ trước`;
}
