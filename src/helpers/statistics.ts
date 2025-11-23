/* eslint-disable unicorn/no-array-reduce */
type Obj = Record<any, any>;

export function average<T extends Obj[]>(
  data: T,
  picker: (value: T[number]) => number,
) {
  const sum = data.reduce((accumulator, next) => accumulator + picker(next), 0);

  return sum / data.length;
}

export function lowest<T extends Obj[]>(
  data: T,
  picker: (value: T[number]) => number,
) {
  return data.reduce((lower, next) => {
    if (picker(next) <= lower) return picker(next);
    return lower;
  }, Infinity);
}

export function highest<T extends Obj[]>(
  data: T,
  picker: (value: T[number]) => number,
) {
  return data.reduce((highest, next) => {
    if (picker(next) >= highest) return picker(next);
    return highest;
  }, -Infinity);
}
