import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { useTestCase } from '../test-case';
import { Cleaner } from 'src/cleaner';

describe('cleaner_browser', () => {
    const { fileContents } = useTestCase();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
    });

    test('static_clean_string_document_33', () => {
        const xmlDirty = [
            'DIRTY',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd http://nrfm.tbwa.mx/AddendaEmisor http://nrfm.tbwa.mx/AddendaEmisor/AddendaEmisorNFRM.xsd http://www.pegasotecnologia.com/secfd/Schemas/AddendaDomicilioEmisor http://www.pegasotecnologia.com/secfd/schemas/AddendaDomicilioEmisor.xsd http://www.pegasotecnologia.com/secfd/Schemas/AddendaDomicilioExpedidoEn http://www.pegasotecnologia.com/secfd/schemas/AddendaDomicilioExpedidoEn.xsd"',
            ' Version="3.3"/>',
        ].join('');

        let xmlClean = Cleaner.staticClean(xmlDirty);

        const expected = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
            ' Version="3.3"/>',
        ].join('');

        // At the moment 20/01/2023 exists a bug on environment browser with jsdom this block is a temporally workaround
        if (!xmlClean.startsWith('<?xml version="1.0"?>')) {
            xmlClean = `<?xml version="1.0"?>${xmlClean}`;
        }

        expect(xmlClean).toEqualXML(expected);
    });

    test('clean_xml_document_33', () => {
        const _document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi33.xsd"',
                ' Version="3.3"/>',
            ].join('\n'),
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(_document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
                ' Version="3.3"/>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('static_clean_string_document_40', () => {
        const xmlDirty = [
            'DIRTY',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi40.xsd"',
            ' Version="4.0"/>',
        ].join('');

        let xmlClean = Cleaner.staticClean(xmlDirty);

        const expected = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
            ' Version="4.0"/>',
        ].join('');

        // At the moment 20/01/2023 exists a bug on environment browser with jsdom this block is a temporally workaround
        if (!xmlClean.startsWith('<?xml version="1.0"?>')) {
            xmlClean = `<?xml version="1.0"?>${xmlClean}`;
        }

        expect(xmlClean).toEqualXML(expected);
    });

    test('clean_xml_document_40', () => {
        const _document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi44.xsd"',
                ' Version="4.0"/>',
            ].join('\n'),
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(_document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
                'Version="4.0"/>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('clean_xml_document_40_with_addendas', () => {
        const _document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 cfdi44.xsd"',
                ' Version="4.0">',
                '   <cfdi:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </cfdi:Addenda>',
                '</cfdi:Comprobante>',
            ].join('\n'),
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(_document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
                ' Version="4.0">',
                '</cfdi:Comprobante>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test.each([['cfdi32-real.xml'], ['cfdi33-real.xml']])('clean_known_files_%s', (filename: string) => {
        const contents = fileContents(filename);
        const _document = Xml.newDocumentContent(contents);

        const cleaner = new Cleaner();
        cleaner.cleanDocument(_document);
        const cleanDocument = cleaner.cleanStringToDocument(contents);

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(cleanDocument);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
