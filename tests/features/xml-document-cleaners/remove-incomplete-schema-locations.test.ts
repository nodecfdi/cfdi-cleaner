import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveIncompleteSchemaLocations } from '~/index';

describe('Feat/RemoveIncompleteSchemaLocations', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('clean schema locations with incomplete pairs only on root', () => {
        const document = Xml.newDocumentContent(
            [
                '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/foo http://tempuri.org/bar bar.xsd"',
                '/>'
            ].join('\n')
        );
        const expected = Xml.newDocumentContent(
            [
                '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/bar bar.xsd"',
                '/>'
            ].join('\n')
        );

        const cleaner = new RemoveIncompleteSchemaLocations();
        cleaner.clean(document);

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('clean schema locations with incomplete pairs only on children', () => {
        // content has incomplete schema location "foo"
        const document = Xml.newDocumentContent(
            [
                '<root>',
                '<child xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                'x:schemaLocation="http://tempuri.org/foo            foo.xsd',
                'http://tempuri.org/remove-first',
                'http://tempuri.org/bar            bar.xsd',
                'http://tempuri.org/remove-other',
                'http://tempuri.org/remove-ns      http://tempuri.org/remove-non-xsd  "',
                '/>',
                '</root>'
            ].join('\n')
        );

        const expected = Xml.newDocumentContent(
            [
                '<root>',
                '<child xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                'x:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
                '</root>'
            ].join('\n')
        );

        const cleaner = new RemoveIncompleteSchemaLocations();
        cleaner.clean(document);

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
