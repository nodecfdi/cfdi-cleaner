import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import { SpecimenXmlNamespaceMethods } from './specimen_xml_namespace_methods.js';

describe('internal xml_namespace_methods', () => {
  test('iterate on removed namespaces', () => {
    const specimen = new SpecimenXmlNamespaceMethods();
    const namespaces: Record<string, string> = {
      root: 'http://tempuri.org/root',
      unused: 'http://tempuri.org/unused',
      foo: 'http://tempuri.org/foo',
    };

    const document = newDocumentContent(
      [
        '<root:root xmlns:root="http://tempuri.org/root" xmlns:unused="http://tempuri.org/unused">',
        '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
        '</root:root>',
      ].join('\n'),
    );
    expect(specimen.obtainNamespaces(document)).toStrictEqual(namespaces);

    // Remove unused namespace
    specimen.removeNamespaceNodesWithNamespace(document, 'http://tempuri.org/unused');
    delete namespaces.unused;

    // List of nodes should be the same
    expect(specimen.obtainNamespaces(document)).toStrictEqual(namespaces);

    const expected = newDocumentContent(
      [
        '<root:root xmlns:root="http://tempuri.org/root">',
        '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
        '</root:root>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
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
    'remove namespace node attribute %s',
    (_name: string, target: string, xmlImput: string, xmlExpected: string) => {
      const specimen = new SpecimenXmlNamespaceMethods();
      const document = newDocumentContent(xmlImput);
      const testElement = document.getElementsByTagName('r:test').item(0);

      // Find an remove unused "xmlns:unused"
      for (const namespaceNode of specimen.pIterateNonReservedNamespaces(document)) {
        if (testElement === namespaceNode.ownerElement && target === namespaceNode.nodeName) {
          specimen.pRemoveNamespaceNodeAttribute(namespaceNode);
        }
      }

      const expected = newDocumentContent(xmlExpected);

      const xmlCleanString = getSerializer().serializeToString(document);
      const xmlExpectedString = getSerializer().serializeToString(expected);
      expect(xmlCleanString).toEqualXML(xmlExpectedString);
    },
  );
});
