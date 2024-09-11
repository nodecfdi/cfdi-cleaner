import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import RemoveNonSatNamespacesNodes from '#src/xml_document_cleaners/remove_non_sat_namespaces_nodes';

describe('remove non sat namespaces nodes', () => {
  test('clean', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:x="http://tempuri.org/x" x:remove="me"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdv33.xsd"',
        '   >',
        '   <cfdi:Emisor Rfc="COSC8001137NA"/>',
        '   <cfdi:Addenda>',
        '       <x:remove foo="foo"/>',
        '       <y:remove-me-too xmlns:y="lorem"/>',
        '   </cfdi:Addenda>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const cleaner = new RemoveNonSatNamespacesNodes();
    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:x="http://tempuri.org/x"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdv33.xsd"',
        '   >',
        '   <cfdi:Emisor Rfc="COSC8001137NA"/>',
        '   <cfdi:Addenda>',
        '   </cfdi:Addenda>',
        '</cfdi:Comprobante> ',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
