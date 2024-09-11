import { type Constructor } from '#src/types';

export class ExcludeList {
  private readonly _classNames: Constructor[];

  public constructor(...classNames: Constructor[]) {
    this._classNames = classNames;
  }

  public isEmpty(): boolean {
    return this._classNames.length === 0;
  }

  public matchClass(object: unknown): boolean {
    for (const className of this._classNames) {
      if (object instanceof className) {
        return true;
      }
    }

    return false;
  }

  public filterObjects<T>(...objects: T[]): T[] {
    return objects.filter((objectEntry) => {
      return !this.matchClass(objectEntry);
    });
  }

  public [Symbol.iterator](): IterableIterator<Constructor> {
    return this._classNames[Symbol.iterator]();
  }
}
