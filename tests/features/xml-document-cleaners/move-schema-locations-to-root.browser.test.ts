import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { MoveSchemaLocationsToRoot } from 'src/xml-document-cleaners/move-schema-locations-to-root';

describe('move_schema_location_to_root_browser', () => {
  let cleaner: MoveSchemaLocationsToRoot;

  beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), document.implementation);
    cleaner = new MoveSchemaLocationsToRoot();
  });

  test('move_schema_locations_to_root_with_children_schemaLocations', () => {
    const _document = Xml.newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        ' xsi:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/bar bar.xsd">',
        '    <foo xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
        '        <bar xsi:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
        '    </foo>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(_document);

    const expectedLocations = [
      'http://tempuri.org/root root.xsd',
      'http://tempuri.org/bar bar.xsd',
      'http://tempuri.org/foo foo.xsd',
    ].join(' ');
    const expected = Xml.newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        ` xsi:schemaLocation="${expectedLocations}">`,
        '   <foo>',
        '       <bar />',
        '   </foo>',
        '</root>',
      ].join('\n'),
    );

    const xmlClean = new XMLSerializer().serializeToString(_document);
    const xmlExpected = new XMLSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move_schema_locations_to_root_with_different_prefix', () => {
    const _document = Xml.newDocumentContent(
      [
        '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
        '   xs:schemaLocation="http://tempuri.org/root root.xsd">',
        '    <foo xs:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(_document);

    const expected = Xml.newDocumentContent(
      [
        '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
        '  xs:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/foo foo.xsd">',
        '   <foo/>',
        '</root>',
      ].join('\n'),
    );
    const xmlClean = new XMLSerializer().serializeToString(_document);
    const xmlExpected = new XMLSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move_schema_locations_to_root_without_root_schema_location', () => {
    const _document = Xml.newDocumentContent(
      [
        '<root>',
        '    <foo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '       xsi:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
        '</root>',
      ].join('\n'),
    );

    cleaner.clean(_document);

    const expected = Xml.newDocumentContent(
      [
        '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
        '   <foo/>',
        '</root>',
      ].join('\n'),
    );
    const xmlClean = new XMLSerializer().serializeToString(_document);
    const xmlExpected = new XMLSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
