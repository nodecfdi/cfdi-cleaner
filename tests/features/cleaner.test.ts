import 'jest-xml-matcher';
import { Cleaner } from '../../src';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { XMLSerializer } from '@xmldom/xmldom';
import { TestCase } from '../test-case';

describe('Cleaner', () => {
    test('static clean string document', () => {
        const xmlDirty = [
            'DIRTY',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi33.xsd"',
            ' Version="3.3"/>',
        ].join('');

        const xmlClean = Cleaner.staticClean(xmlDirty);

        const expected = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
            ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
            ' Version="3.3"/>',
        ].join('');

        expect(xmlClean).toEqualXML(expected);
    });

    test('clean xml document', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi33.xsd"',
                ' Version="3.3"/>',
            ].join('\n')
        );

        const cleaner = new Cleaner();
        cleaner.cleanDocument(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                'xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
                'Version="3.3"/>',
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
