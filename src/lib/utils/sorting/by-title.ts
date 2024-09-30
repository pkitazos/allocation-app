export const compareTitle = (a: { title: string }, b: { title: string }) =>
  a.title.localeCompare(b.title);
