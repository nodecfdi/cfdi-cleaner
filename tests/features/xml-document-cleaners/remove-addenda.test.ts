import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveAddenda } from '~/index';

describe('RemoveAddenda', () => {
    let cleaner: RemoveAddenda;

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        cleaner = new RemoveAddenda();
    });

    test('clean document with addenda', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                '   <cfdi:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </cfdi:Addenda>',
                '</cfdi:Comprobante>'
            ].join('\n')
        );

        cleaner.clean(document);
        // Addenda element should not exist after cleaning
        expect(Array.from(document.getElementsByTagNameNS('http://www.sat.gob.mx/cfd/3', 'Addenda'))).toHaveLength(0);
    });

    test('clean document with addenda cfdi4.0', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4">',
                '   <cfdi:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </cfdi:Addenda>',
                '</cfdi:Comprobante>'
            ].join('\n')
        );

        cleaner.clean(document);
        // Addenda element should not exist after cleaning
        expect(Array.from(document.getElementsByTagNameNS('http://www.sat.gob.mx/cfd/4', 'Addenda'))).toHaveLength(0);
    });
});
