import 'jest-xml-matcher';
import { SpecimenXmlNamespaceMethodsTrait } from './specimen-xml-namespace-methods-trait';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { XMLSerializer } from '@xmldom/xmldom';

describe('Internal/XmlNamespaceMethodsTrait', () => {
    test('iterate on removed namespaces', () => {
        const specimen = new SpecimenXmlNamespaceMethodsTrait();
        const namespaces: Record<string, string> = {
            root: 'http://tempuri.org/root',
            unused: 'http://tempuri.org/unused',
            foo: 'http://tempuri.org/foo',
        };

        const document = Xml.newDocumentContent(
            [
                '<root:root xmlns:root="http://tempuri.org/root" xmlns:unused="http://tempuri.org/unused">',
                '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
                '</root:root>',
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
                '</root:root>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
