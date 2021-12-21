/**
 * Helper class to work with xsi:schemaLocation attribute
 *
 * @internal
 */
export class SchemaLocation {
    private pairs: Record<string, string>;

    /**
     * SchemaLocation constructor
     *
     * @param pairs On each entry: key is namespace, value is location
     * @private
     */
    constructor(pairs: Record<string, string>) {
        this.pairs = pairs;
    }

    public static createFromValue(value: string): SchemaLocation {
        return SchemaLocation.createFromComponents(SchemaLocation.valueToComponents(value));
    }

    public static valueToComponents(schemaLocationValue: string): string[] {
        return schemaLocationValue
            .replace(/\s/g, ' ')
            .split(' ')
            .filter((x) => x && x !== '');
    }

    public static createFromComponents(components: string[]): SchemaLocation {
        const pairs: Record<string, string> = {};
        for (let i = 0; i < components.length; i = i + 2) {
            pairs[components[i]] = components[i + 1] || '';
        }
        return new SchemaLocation(pairs);
    }

    public getPairs(): Record<string, string> {
        return this.pairs;
    }

    public setPair(namespace: string, location: string): void {
        this.pairs[namespace] = location;
    }

    public filterUsingNamespace(filterFunction: (key: string) => boolean): void {
        this.pairs = Object.fromEntries(Object.entries(this.pairs).filter((obj) => filterFunction(obj[0])));
    }

    public asValue(): string {
        return Object.entries(this.pairs)
            .map((obj) => {
                return `${obj[0]} ${obj[1]}`;
            })
            .join(' ');
    }

    public import(source: SchemaLocation): void {
        this.pairs = {
            ...this.pairs,
            ...source.pairs,
        };
    }
}
