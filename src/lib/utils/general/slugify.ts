export function slugifyOLD(label: string): string {
  return label.replaceAll("&", "and").replaceAll(" ", "-").toLowerCase();
}

export function slugify(label: string) {
  return encodeURIComponent(
    label
      .replaceAll("&", "and")
      .replaceAll(" ", "-")
      .replaceAll("level", "lvl")
      .toLowerCase(),
  );
}
