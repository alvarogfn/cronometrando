export function getFromStorage<T extends boolean | number | string>(
  key: string,
  ifAbsent: T,
  coerce?: (...args: any[]) => T,
): T {
  const loadedItem = localStorage.getItem(key);

  if (!loadedItem) {
    return ifAbsent;
  }

  if (coerce) return coerce(loadedItem);

  return loadedItem as T;
}

export function setToStorage<T extends boolean | number | string>(
  key: string,
  value: T,
): boolean {
  localStorage.setItem(key, String(value));

  return true;
}
