export type Maybe<T> = T | undefined;

export function maybe(value: any): Maybe<any> {
  return value ?? undefined;
}