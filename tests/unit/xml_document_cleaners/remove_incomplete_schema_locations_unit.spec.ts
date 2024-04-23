import { RemoveIncompleteSchemaLocations } from '#src/xml_document_cleaners/remove_incomplete_schema_locations';

describe('remove_incomplete_schema_locations', () => {
  let cleaner: RemoveIncompleteSchemaLocations;

  beforeAll(() => {
    cleaner = new RemoveIncompleteSchemaLocations();
  });

  test('schema_location_value_namespace_xsd_pair_to_array', () => {
    const input = [
      'http://tempuri.org/root http://tempuri.org/root.xsd',
      'http://tempuri.org/foo',
      'http://tempuri.org/bar http://tempuri.org/bar.xsd',
      '                       http://tempuri.org/one.xsd',
      'http://tempuri.org/two http://tempuri.org/two.xsd',
      'http://tempuri.org/three http://tempuri.org/three',
    ].join(' ');

    const expectedPairs = {
      'http://tempuri.org/root': 'http://tempuri.org/root.xsd',
      'http://tempuri.org/bar': 'http://tempuri.org/bar.xsd',
      'http://tempuri.org/two': 'http://tempuri.org/two.xsd',
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
    ['location..xsd', true],
  ])('uri_ends_with_xsd_%s', (uri: string, expected: boolean) => {
    expect(cleaner.uriEndsWithXsd(uri)).toBe(expected);
  });
});
