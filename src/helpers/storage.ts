export function getFromStorage<T extends number | string>(
  key: string,
  ifAbsent: T,
): T {
  const loadedItem = localStorage.getItem(key);

  if (!loadedItem) {
    return ifAbsent;
  }

  return loadedItem as T;
}

export function setToStorage<T extends number | string>(
  key: string,
  value: T,
): boolean {
  localStorage.setItem(key, String(value));

  return true;
}
