
/**
 * Convert Convex Time to Display Format
 * @param creationTime Convex time format
 * @returns 
 */
export const ConvexTimeToDisplayFormat = (creationTime: number) => {
  const date = new Date(creationTime);
  return date.toLocaleDateString('en-NZ', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

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