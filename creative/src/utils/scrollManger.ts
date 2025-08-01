// src/utils/scrollManager.ts
const scrollPositions = new Map<string, number>();

export const saveScrollPosition = (key: string) => {
  scrollPositions.set(key, window.scrollY);
};

export const getScrollPosition = (key: string) => {
  return scrollPositions.get(key) || 0;
};
