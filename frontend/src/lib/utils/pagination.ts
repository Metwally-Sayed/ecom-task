export function clampPage(page?: number) {
  if (!page || Number.isNaN(page)) {
    return 1;
  }

  return Math.max(1, Math.trunc(page));
}

export function getPaginationRange(page: number, totalPages: number) {
  const current = clampPage(page);
  const safeTotal = Math.max(1, totalPages);
  const start = Math.max(1, current - 2);
  const end = Math.min(safeTotal, current + 2);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
