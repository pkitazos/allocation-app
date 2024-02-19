export function toPositional(n: number) {
  const lastDigit = n % 10;
  const suffix =
    lastDigit === 1
      ? "st"
      : lastDigit === 2
      ? "nd"
      : lastDigit === 3
      ? "rd"
      : "th";
  return `${n}${suffix}`;
}
