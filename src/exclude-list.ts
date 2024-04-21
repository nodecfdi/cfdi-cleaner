export class ExcludeList {
  private readonly _classNames: Array<new () => unknown>;

  constructor(...classNames: Array<new () => unknown>) {
    this._classNames = classNames;
  }

  public isEmpty(): boolean {
    return this._classNames.length === 0;
  }

  public match(object: unknown): boolean {
    for (const className of this._classNames) {
      if (object instanceof className) {
        return true;
      }
    }

    return false;
  }

  public filterObjects<T>(...objects: T[]): T[] {
    // eslint-disable-next-line unicorn/prefer-regexp-test
    return objects.filter((object_) => !this.match(object_));
  }

  public [Symbol.iterator](): IterableIterator<new () => unknown> {
    return this._classNames[Symbol.iterator]();
  }
}
