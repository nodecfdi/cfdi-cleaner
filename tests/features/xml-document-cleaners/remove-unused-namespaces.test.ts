import 'jest-xml-matcher';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { RemoveUnusedNamespaces } from '../../../src';
import { XMLSerializer } from '@xmldom/xmldom';

describe('RemoveUnusedNamespaces', () => {
    let cleaner: RemoveUnusedNamespaces;

    beforeAll(() => {
        cleaner = new RemoveUnusedNamespaces();
    });

    test('remove unused namespaces on root', () => {
        const document = Xml.newDocumentContent(
            [
                '<r:root',
                '   xmlns:b="http://tempuri.org/bar"',
                '   xmlns:r="http://tempuri.org/root"',
                '   xmlns:f="http://tempuri.org/foo"',
                '/>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove unused namespaces on children', () => {
        const document = Xml.newDocumentContent(
            [
                '<r:root xmlns:b="http://tempuri.org/bar" xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child xmlns:xee="http://tempuri.org/xee" f:foo="foo"/>',
                '   </a:child>',
                '</r:root>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
                '   <a:child xmlns:a="http://tempuri.org/a">',
                '       <a:child f:foo="foo"/>',
                '   </a:child>',
                '</r:root>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
