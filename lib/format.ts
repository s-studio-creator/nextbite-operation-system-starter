export function formatHealthScore(score?: number) {
  if (score === undefined) {
    return "New";
  }

  return `${score}`;
}
