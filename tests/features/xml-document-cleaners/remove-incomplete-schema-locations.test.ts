import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveIncompleteSchemaLocations } from 'src/xml-document-cleaners/remove-incomplete-schema-locations';

describe('remove_incomplete_schema_locations', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('clean_schema_locations_with_incomplete_pairs_only_on_root', () => {
        const document = Xml.newDocumentContent(
            [
                '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/foo http://tempuri.org/bar bar.xsd"',
                '/>',
            ].join('\n'),
        );
        const expected = Xml.newDocumentContent(
            [
                '<r xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                ' x:schemaLocation="http://tempuri.org/r r.xsd http://tempuri.org/bar bar.xsd"',
                '/>',
            ].join('\n'),
        );

        const cleaner = new RemoveIncompleteSchemaLocations();
        cleaner.clean(document);

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('clean_schema_locations_with_incomplete_pairs_only_on_children', () => {
        // Content has incomplete schema location "foo"
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
                '</root>',
            ].join('\n'),
        );

        const expected = Xml.newDocumentContent(
            [
                '<root>',
                '<child xmlns="http://tempuri.org/r" xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
                'x:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
                '</root>',
            ].join('\n'),
        );

        const cleaner = new RemoveIncompleteSchemaLocations();
        cleaner.clean(document);

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
