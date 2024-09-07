export function formatProfile(profile: number[]) {
  return profile.length === 0 ? "-" : `(${profile.join(", ")})`;
}

export function formatWeight(weight: number) {
  return Number.isNaN(weight) ? "-" : weight;
}

export function formatSize(size: number) {
  return Number.isNaN(size) ? "-" : size;
}
