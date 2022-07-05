import { RemoveIncompleteSchemaLocations } from '~/xml-document-cleaners/remove-incomplete-schema-locations';

describe('RemoveIncompleteSchemaLocations', () => {
    let cleaner: RemoveIncompleteSchemaLocations;

    beforeAll(() => {
        cleaner = new RemoveIncompleteSchemaLocations();
    });

    test('schema location value namespace xsd pair to array', () => {
        const input = [
            'http://tempuri.org/root http://tempuri.org/root.xsd',
            'http://tempuri.org/foo',
            'http://tempuri.org/bar http://tempuri.org/bar.xsd',
            'http://tempuri.org/one.xsd',
            'http://tempuri.org/two http://tempuri.org/two.xsd',
            'http://tempuri.org/three http://tempuri.org/three'
        ]
            .join(' ')
            .trim();

        const expectedPairs = {
            'http://tempuri.org/root': 'http://tempuri.org/root.xsd',
            'http://tempuri.org/bar': 'http://tempuri.org/bar.xsd',
            'http://tempuri.org/two': 'http://tempuri.org/two.xsd'
        };

        const pairs = cleaner.schemaLocationValueNamespaceXsdPairToArray(input);
        expect(pairs).toStrictEqual(expectedPairs);
    });

    test.each([
        ['location', false],
        ['locationxsd', false],
        ['', false],
        ['location.xsd', true],
        ['location.XSD', true],
        ['location.Xsd', true],
        ['location..xsd', true]
    ])('uri ends with xsd', (uri: string, expected: boolean) => {
        expect(cleaner.uriEndsWithXsd(uri)).toBe(expected);
    });
});
