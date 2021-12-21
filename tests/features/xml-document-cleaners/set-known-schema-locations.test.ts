import 'jest-xml-matcher';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { SetKnownSchemaLocations } from '../../../src';
import { XMLSerializer } from '@xmldom/xmldom';

describe('SetKnownSchemaLocations', () => {
    let cleaner: SetKnownSchemaLocations;

    beforeAll(() => {
        cleaner = new SetKnownSchemaLocations();
    });

    test('set known schema locations', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"',
                '>',
                '   <cfdi:Complemento>',
                '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
                '           xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital tfd.xsd"',
                '       />',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n')
        );

        cleaner.clean(document);

        const xsdCfd = 'http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd';
        const xsdTfd = 'http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd';

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                `   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 ${xsdCfd}"`,
                '>',
                '   <cfdi:Complemento>',
                '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
                `           xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital ${xsdTfd}"`,
                '       />',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('set known schema locations without version', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('set known schema locations with unknown namespace', () => {
        const document = Xml.newDocumentContent(
            [
                '<foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                ' <foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
