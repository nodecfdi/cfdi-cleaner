/**
 * \@vitest-environment jsdom
 */

import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { RemoveUnusedNamespaces } from '~/xml-document-cleaners/remove-unused-namespaces';

describe('RemoveUnusedNamespaces_Browser', () => {
    let cleaner: RemoveUnusedNamespaces;

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        cleaner = new RemoveUnusedNamespaces();
    });

    test('remove unused namespaces on root', () => {
        const _document = Xml.newDocumentContent(
            [
                '<r:root',
                '   xmlns:b="http://tempuri.org/bar"',
                '   xmlns:r="http://tempuri.org/root"',
                '   xmlns:f="http://tempuri.org/foo"',
                '/>'
            ].join('\n')
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove unused namespaces on children', () => {
        const _document = Xml.newDocumentContent(
            [
                '<r:root xmlns:b="http://tempuri.org/bar" xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child xmlns:xee="http://tempuri.org/xee" f:foo="foo"/>',
                '   </a:child>',
                '</r:root>'
            ].join('\n')
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child f:foo="foo"/>',
                '   </a:child>',
                '</r:root>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove duplicated namespaces prefixes', () => {
        const _document = Xml.newDocumentContent(
            [
                '<root:root',
                '  xmlns:wrong="http://tempuri.org/namespace"',
                '  xmlns:root="http://tempuri.org/root"',
                '  xmlns:attr="http://tempuri.org/attributes">',
                '  <fine:child xmlns:fine="http://tempuri.org/namespace" attr:x="y"/>',
                '</root:root>'
            ].join('\n')
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
            [
                '<root:root',
                '  xmlns:root="http://tempuri.org/root"',
                '  xmlns:attr="http://tempuri.org/attributes">',
                '  <fine:child xmlns:fine="http://tempuri.org/namespace" attr:x="y"/>',
                '</root:root>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
