export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function mock<T>(data: T) {
  await delay(2000);
  return data;
}
