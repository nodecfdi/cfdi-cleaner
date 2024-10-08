import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import RemoveNonSatSchemaLocations from '#src/xml_document_cleaners/remove_non_sat_schema_locations';

describe('remove non sat schema locations', () => {
  test('clean', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
        '   xmlns:extra="http://www.sat.gob.mx/extra"',
        '   xsi:schemaLocation="',
        '   http://www.sat.gob.mx/cfd/3        cfd33.xsd',
        '   http://www.sat.gob.mx/extra        extra.xsd',
        '   http://tempuri.org/bar             bar.xsd',
        '   ">',
        '   <cfdi:Complemento>',
        '       <extra:Extra/>',
        '   </cfdi:Complemento>',
        '   <cfdi:Addenda>',
        '       <foo:foo xmlns:foo="http://tempuri.org/foo" xsi:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
        '   </cfdi:Addenda>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const cleaner = new RemoveNonSatSchemaLocations();
    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
        '   xmlns:extra="http://www.sat.gob.mx/extra"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfd33.xsd http://www.sat.gob.mx/extra extra.xsd">',
        '   <cfdi:Complemento>',
        '       <extra:Extra/>',
        '   </cfdi:Complemento>',
        '   <cfdi:Addenda>',
        '       <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
        '   </cfdi:Addenda>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
