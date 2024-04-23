import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import { MoveSchemaLocationsToRoot } from '#src/xml_document_cleaners/move_schema_locations_to_root';

describe('move schema location to_root', () => {
  let cleaner: MoveSchemaLocationsToRoot;

  beforeAll(() => {
    cleaner = new MoveSchemaLocationsToRoot();
  });

  test('move schema locations to_root', () => {
    const document = newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        ' xsi:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/bar bar.xsd">',
        '    <foo xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
        '        <bar xsi:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
        '    </foo>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expectedLocations = [
      'http://tempuri.org/root root.xsd',
      'http://tempuri.org/bar bar.xsd',
      'http://tempuri.org/foo foo.xsd',
    ].join(' ');
    const expected = newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        ` xsi:schemaLocation="${expectedLocations}">`,
        '   <foo>',
        '       <bar />',
        '   </foo>',
        '</root>',
      ].join('\n'),
    );
    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move schema locations to root with different prefix', () => {
    const document = newDocumentContent(
      [
        '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
        '   xs:schemaLocation="http://tempuri.org/root root.xsd">',
        '    <foo xs:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
        '  xs:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/foo foo.xsd">',
        '   <foo/>',
        '</root>',
      ].join('\n'),
    );
    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move schema locations to root without root schema location', () => {
    const document = newDocumentContent(
      [
        '<root>',
        '    <foo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '       xsi:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
        '   <foo/>',
        '</root>',
      ].join('\n'),
    );
    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
