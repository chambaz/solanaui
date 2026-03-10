type SortDirection = "asc" | "desc" | null;

const parseNumericValue = (value: string): number => {
  const cleaned = value.replace(/[$,%x,+]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
};

const isNumericString = (value: string): boolean => {
  const cleaned = value.replace(/[$,%x,+\s-]/g, "");
  return /\d/.test(cleaned);
};

const compareValues = (a: string, b: string): number => {
  if (isNumericString(a) || isNumericString(b)) {
    return parseNumericValue(a) - parseNumericValue(b);
  }
  return a.localeCompare(b);
};

export type { SortDirection };
export { parseNumericValue, isNumericString, compareValues };
