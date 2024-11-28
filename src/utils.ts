//// Date & Time utilities
export const dateString = (date?: Date) => {
  if (!date) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const timeString = (date?: Date) => {
  if (!date) {
    date = new Date();
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}-${minutes}-${seconds}`;
};

export const dateTimeString = () => {
  const date = new Date();
  return `${dateString(date)}-${timeString(date)}`;
};
