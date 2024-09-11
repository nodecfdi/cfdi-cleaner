import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import RemoveIncompleteSchemaLocations from '#src/xml_document_cleaners/remove_incomplete_schema_locations';

describe('remove incomplete schema locations', () => {
  test('clean schema locations with incomplete pairs only on root', () => {
    const document = newDocumentContent(
      [
        '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/foo http://tempuri.org/bar bar.xsd"',
        '/>',
      ].join('\n'),
    );
    const expected = newDocumentContent(
      [
        '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/bar bar.xsd"',
        '/>',
      ].join('\n'),
    );

    const cleaner = new RemoveIncompleteSchemaLocations();
    cleaner.clean(document);

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('clean schema locations with incomplete pairs only on children', () => {
    // Content has incomplete schema location "foo"
    const document = newDocumentContent(
      [
        '<root>',
        '<child xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        'x:schemaLocation="http://tempuri.org/foo            foo.xsd',
        'http://tempuri.org/remove-first',
        'http://tempuri.org/bar            bar.xsd',
        'http://tempuri.org/remove-other',
        'http://tempuri.org/remove-ns      http://tempuri.org/remove-non-xsd  "',
        '/>',
        '</root>',
      ].join('\n'),
    );

    const expected = newDocumentContent(
      [
        '<root>',
        '<child xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        'x:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
        '</root>',
      ].join('\n'),
    );

    const cleaner = new RemoveIncompleteSchemaLocations();
    cleaner.clean(document);

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
