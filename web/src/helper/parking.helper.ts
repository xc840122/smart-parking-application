export const addressGenerator = async (
  city: string,
  area: string,
  street: string,
  unit: string,
) => {
  return `${unit}\r\n${street}\r\n${area}\r\n${city}   `
}