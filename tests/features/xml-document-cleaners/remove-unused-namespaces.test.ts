import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveUnusedNamespaces } from 'src/xml-document-cleaners/remove-unused-namespaces';

describe('remove_unused_namespaces', () => {
    let cleaner: RemoveUnusedNamespaces;

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
        cleaner = new RemoveUnusedNamespaces();
    });

    test('remove_unused_namespaces_on_root', () => {
        const document = Xml.newDocumentContent(
            [
                '<r:root',
                '   xmlns:b="http://tempuri.org/bar"',
                '   xmlns:r="http://tempuri.org/root"',
                '   xmlns:f="http://tempuri.org/foo"',
                '/>',
            ].join('\n'),
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove_unused_namespaces_on_children', () => {
        const document = Xml.newDocumentContent(
            [
                '<r:root xmlns:b="http://tempuri.org/bar" xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child xmlns:xee="http://tempuri.org/xee" f:foo="foo"/>',
                '   </a:child>',
                '</r:root>',
            ].join('\n'),
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child f:foo="foo"/>',
                '   </a:child>',
                '</r:root>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove_duplicated_namespaces_prefixes', () => {
        const document = Xml.newDocumentContent(
            [
                '<root:root',
                '  xmlns:wrong="http://tempuri.org/namespace"',
                '  xmlns:root="http://tempuri.org/root"',
                '  xmlns:attr="http://tempuri.org/attributes">',
                '  <fine:child xmlns:fine="http://tempuri.org/namespace" attr:x="y"/>',
                '</root:root>',
            ].join('\n'),
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<root:root',
                '  xmlns:root="http://tempuri.org/root"',
                '  xmlns:attr="http://tempuri.org/attributes">',
                '  <fine:child xmlns:fine="http://tempuri.org/namespace" attr:x="y"/>',
                '</root:root>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
