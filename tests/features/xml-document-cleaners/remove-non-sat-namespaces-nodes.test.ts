import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveNonSatNamespacesNodes } from 'src/xml-document-cleaners/remove-non-sat-namespaces-nodes';

describe('RemoveNonSatNamespacesNodes', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('clean', () => {
        const document = Xml.newDocumentContent(
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

        const expected = Xml.newDocumentContent(
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

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
