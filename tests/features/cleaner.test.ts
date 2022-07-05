import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { Cleaner } from '~/index';
import { TestCase } from '../test-case';

describe('Cleaner', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('static clean string document 33', () => {
        const xmlDirty = [
            'DIRTY',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd http://nrfm.tbwa.mx/AddendaEmisor http://nrfm.tbwa.mx/AddendaEmisor/AddendaEmisorNFRM.xsd http://www.pegasotecnologia.com/secfd/Schemas/AddendaDomicilioEmisor http://www.pegasotecnologia.com/secfd/schemas/AddendaDomicilioEmisor.xsd http://www.pegasotecnologia.com/secfd/Schemas/AddendaDomicilioExpedidoEn http://www.pegasotecnologia.com/secfd/schemas/AddendaDomicilioExpedidoEn.xsd"',
            ' Version="3.3"/>'
        ].join('');

        const xmlClean = Cleaner.staticClean(xmlDirty);

        const expected = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
            ' Version="3.3"/>'
        ].join('');

        expect(xmlClean).toEqualXML(expected);
    });

    test('clean xml document 33', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi33.xsd"',
                ' Version="3.3"/>'
            ].join('\n')
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                'xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
                'Version="3.3"/>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('static clean string document 40', () => {
        const xmlDirty = [
            'DIRTY',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi40.xsd"',
            ' Version="4.0"/>'
        ].join('');

        const xmlClean = Cleaner.staticClean(xmlDirty);

        const expected = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
            ' Version="4.0"/>'
        ].join('');

        expect(xmlClean).toEqualXML(expected);
    });

    test('clean xml document 40', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi44.xsd"',
                ' Version="4.0"/>'
            ].join('\n')
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                'xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
                'Version="4.0"/>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('clean xml document 40 with addendas', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi44.xsd"',
                ' Version="4.0">',
                '   <cfdi:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </cfdi:Addenda>',
                '</cfdi:Comprobante>'
            ].join('\n')
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                'xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
                'Version="4.0">',
                '</cfdi:Comprobante>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test.each([['cfdi32-real.xml'], ['cfdi33-real.xml']])('clean known files %s', (filename: string) => {
        const contents = TestCase.fileContents(filename);
        const document = Xml.newDocumentContent(contents);

        const cleaner = new Cleaner();
        cleaner.cleanDocument(document);
        const cleanDocument = cleaner.cleanStringToDocument(contents);

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(cleanDocument);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
