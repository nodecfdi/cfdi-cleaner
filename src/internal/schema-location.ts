/**
 * Helper class to work with xsi:schemaLocation attribute
 *
 * @internal
 */
export class SchemaLocation {
  private _pairs: Record<string, string>;

  /**
   * SchemaLocation constructor
   *
   * @param pairs - On each entry: key is namespace, value is location
   *
   */
  constructor(pairs: Record<string, string>) {
    this._pairs = pairs;
  }

  public static createFromValue(value: string): SchemaLocation {
    return SchemaLocation.createFromComponents(SchemaLocation.valueToComponents(value));
  }

  public static valueToComponents(schemaLocationValue: string): string[] {
    return schemaLocationValue
      .replaceAll(/\s/g, ' ')
      .split(' ')
      .filter((x) => x && x !== '');
  }

  public static createFromComponents(components: string[]): SchemaLocation {
    const pairs: Record<string, string> = {};
    for (let index = 0; index < components.length; index += 2) {
      pairs[components[index]] = components[index + 1];
    }

    return new SchemaLocation(pairs);
  }

  public getPairs(): Record<string, string> {
    return this._pairs;
  }

  public setPair(namespace: string, location: string): void {
    this._pairs[namespace] = location;
  }

  public filterUsingNamespace(filterFunction: (key: string) => boolean): void {
    this._pairs = Object.fromEntries(
      Object.entries(this._pairs).filter((object) => filterFunction(object[0])),
    );
  }

  public asValue(): string {
    return Object.entries(this._pairs)
      .map((object) => `${object[0]} ${object[1]}`)
      .join(' ');
  }

  public import(source: SchemaLocation): void {
    this._pairs = {
      ...this._pairs,
      ...source._pairs,
    };
  }
}
