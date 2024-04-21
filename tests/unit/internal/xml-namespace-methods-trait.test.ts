import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { SpecimenXmlNamespaceMethodsTrait } from './specimen-xml-namespace-methods-trait';

describe('internal_xml_namespace_methods_trait', () => {
  beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
  });

  test('iterate_on_removed_namespaces', () => {
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
      ].join('\n'),
    );
    expect(specimen.obtainNamespaces(document)).toEqual(namespaces);

    // Remove unused namespace
    specimen.removeNamespaceNodesWithNamespace(document, 'http://tempuri.org/unused');
    delete namespaces.unused;

    // List of nodes should be the same
    expect(specimen.obtainNamespaces(document)).toEqual(namespaces);

    const expected = Xml.newDocumentContent(
      [
        '<root:root xmlns:root="http://tempuri.org/root">',
        '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
        '</root:root>',
      ].join('\n'),
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
        '</r:root>',
      ].join('\n'),
      ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n'),
    ],
    [
      'no prefix',
      'xmlns',
      [
        '<r:root xmlns:r="http://tempuri.org/root">',
        '  <r:test xmlns="http://tempuri.org/root"/>',
        '</r:root>',
      ].join('\n'),
      ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n'),
    ],
    [
      'no prefix no content',
      'xmlns',
      ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test xmlns=""/>', '</r:root>'].join(
        '\n',
      ),
      ['<r:root xmlns:r="http://tempuri.org/root">', '  <r:test/>', '</r:root>'].join('\n'),
    ],
  ])(
    'remove_namespace_node_attribute_%s',
    (_name: string, target: string, xmlImput: string, xmlExpected: string) => {
      const specimen = new SpecimenXmlNamespaceMethodsTrait();

      const document = Xml.newDocumentContent(xmlImput);

      // eslint-disable-next-line unicorn/prefer-query-selector
      const testElement = document.getElementsByTagName('r:test').item(0);

      // Find an remove unused "xmlns:unused"
      for (const namespaceNode of specimen.pIterateNonReservedNamespaces(document)) {
        if (testElement === namespaceNode.ownerElement && target === namespaceNode.nodeName) {
          specimen.pRemoveNamespaceNodeAttribute(namespaceNode);
        }
      }

      const expected = Xml.newDocumentContent(xmlExpected);

      const xmlCleanString = new XMLSerializer().serializeToString(document);
      const xmlExpectedString = new XMLSerializer().serializeToString(expected);
      expect(xmlCleanString, 'Expected XML is not identical').toEqualXML(xmlExpectedString);
    },
  );
});
