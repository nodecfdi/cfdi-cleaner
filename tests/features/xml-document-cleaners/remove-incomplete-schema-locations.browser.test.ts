import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { RemoveIncompleteSchemaLocations } from 'src/xml-document-cleaners/remove-incomplete-schema-locations';

describe('remove_incomplete_schema_locations_browser', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
    });

    test('clean_schema_locations_with_incomplete_pairs_only_on_root', () => {
        const _document = Xml.newDocumentContent(
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
        cleaner.clean(_document);

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('clean_schema_locations_with_incomplete_pairs_only_on_children', () => {
        // Content has incomplete schema location "foo"
        const _document = Xml.newDocumentContent(
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
        cleaner.clean(_document);

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
