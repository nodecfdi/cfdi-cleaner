import { XmlNsSchemaLocation } from 'src/xml-string-cleaners/xml-ns-schema-location';

describe('XmlNsSchemaLocation', () => {
    test.each([
        [
            'spaces',
            '<root xsi:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
            '<root xmlns:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
        ],
        [
            'tabs',
            '<root\txsi:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
            '<root\txmlns:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
        ],
        [
            'line feed',
            '<root\nxsi:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
            '<root\nxmlns:schemaLocation="http://localhost/a http://localhost/a.xsd"/>',
        ],
    ])('clean %s', (_name, expected, input) => {
        const cleaner = new XmlNsSchemaLocation();
        const clean = cleaner.clean(input);

        expect(clean).toBe(expected);
    });
});
