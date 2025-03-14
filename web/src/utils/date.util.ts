import { toZonedTime, format } from 'date-fns-tz';
/**
 * Convert Convex Time to Display Format
 * @param creationTime Convex time format
 * @returns 
 */
export const convexTimeToDisplayFormat = (creationTime: number) => {
  const date = new Date(creationTime);
  return date.toLocaleDateString('en-NZ', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

export const convexTimeToParkingTime = (creationTime: number) => {
  const date = new Date(creationTime);
  return date.toLocaleTimeString('en-NZ', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Convert timestamp to local date time, <Input type="datetime-local" /> requires the format to be in yyyy-MM-dd'T'HH:mm
 * @param timestamp 
 * @returns 
 */
export const convertToDateTimeLocal = (timestamp: number) => {
  // return new Date(timestamp).toISOString().slice(0, 16);
  const timeZone = 'Pacific/Auckland'; // Set to New Zealand timezone
  // Convert the timestamp to the specified time zone
  const zonedDate = toZonedTime(timestamp, timeZone);
  // Format the date in the desired format (yyyy-MM-dd'T'HH:mm)
  const localFormatted = format(zonedDate, 'yyyy-MM-dd\'T\'HH:mm', { timeZone });

  return localFormatted;
};

/**
 * Convert Search Params date string to convex Time
 * @param date date string(yyyy-mm-dd)
 * @returns 
 */
export const DateToConvexTime = (date: string, startDate: boolean) => {
  if (startDate) {
    return (new Date(date)).setHours(0, 0, 0, 0);
  }
  return (new Date(date)).setHours(23, 59, 59, 999);
}