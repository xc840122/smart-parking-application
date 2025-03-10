export const addressGenerator = (
  city: string,
  area: string,
  street: string,
  unit: string,
) => {
  return `${unit}\r\n${street}\r\n${area}\r\n${city}   `
}