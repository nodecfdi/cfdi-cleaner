import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { RemoveNonSatSchemaLocations } from 'src/xml-document-cleaners/remove-non-sat-schema-locations';

describe('remove_non_sat_schema_locations_browser', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
    });

    test('clean', () => {
        const _document = Xml.newDocumentContent(
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
        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
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

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
