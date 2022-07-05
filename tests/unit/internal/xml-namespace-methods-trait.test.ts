import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { SpecimenXmlNamespaceMethodsTrait } from './specimen-xml-namespace-methods-trait';

describe('Internal/XmlNamespaceMethodsTrait', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('iterate on removed namespaces', () => {
        const specimen = new SpecimenXmlNamespaceMethodsTrait();
        const namespaces: Record<string, string> = {
            root: 'http://tempuri.org/root',
            unused: 'http://tempuri.org/unused',
            foo: 'http://tempuri.org/foo'
        };

        const document = Xml.newDocumentContent(
            [
                '<root:root xmlns:root="http://tempuri.org/root" xmlns:unused="http://tempuri.org/unused">',
                '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
                '</root:root>'
            ].join('\n')
        );
        expect(specimen.obtainNamespaces(document)).toEqual(namespaces);

        // remove unused namespace
        specimen.removeNamespaceNodesWithNamespace(document, 'http://tempuri.org/unused');
        delete namespaces.unused;

        // list of nodes should be the same
        expect(specimen.obtainNamespaces(document)).toEqual(namespaces);

        const expected = Xml.newDocumentContent(
            [
                '<root:root xmlns:root="http://tempuri.org/root">',
                '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
                '</root:root>'
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test.each([
        [
            'unused',
            'xmlns:unused',
            [
                '<r:root xmlns:r="http://tempuri.org/root">',
                '  <r:test xmlns:unused="http://tempuri.org/root"/>',
                '</r:root>'
            ].join('\n'),
            ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n')
        ],
        [
            'no prefix',
            'xmlns',
            [
                '<r:root xmlns:r="http://tempuri.org/root">',
                '  <r:test xmlns="http://tempuri.org/root"/>',
                '</r:root>'
            ].join('\n'),
            ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n')
        ],
        [
            'no prefix no content',
            'xmlns',
            ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test xmlns=""/>', '</r:root>'].join('\n'),
            ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n')
        ]
    ])('remove namespace node attribute %s', (_name: string, target: string, xmlImput: string, xmlExpected: string) => {
        const specimen = new SpecimenXmlNamespaceMethodsTrait();

        const document = Xml.newDocumentContent(xmlImput);

        const testElement = document.getElementsByTagName('test').item(0);

        // find an remove unused "xmlns:unused"
        for (const namespaceNode of specimen.pIterateNonReservedNamespaces(document)) {
            if (testElement === namespaceNode.parentElement && target === namespaceNode.nodeName) {
                specimen.pRemoveNamespaceNodeAttribute(namespaceNode);
            }
        }

        const expected = Xml.newDocumentContent(xmlExpected);

        const xmlCleanStr = new XMLSerializer().serializeToString(document);
        const xmlExpectedStr = new XMLSerializer().serializeToString(expected);
        expect(xmlCleanStr).toEqualXML(xmlExpectedStr);
    });
});
