export function slugify(label: string): string {
  return label.replaceAll("&", "and").replaceAll(" ", "-").toLowerCase();
}
