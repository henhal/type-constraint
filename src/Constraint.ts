export default class Constraint<T> {
  static of<T>() {
    return new Constraint<T>();
  }

  private constructor() {
  }

  partial<U extends Partial<T>>(x: U) {
    return x;
  }

  pick<K extends keyof T>(x: Pick<T, K>) {
    return x;
  }
}