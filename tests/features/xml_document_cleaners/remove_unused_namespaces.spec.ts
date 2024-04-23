import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import { RemoveUnusedNamespaces } from '#src/xml_document_cleaners/remove_unused_namespaces';

describe('remove unused namespaces', () => {
  let cleaner: RemoveUnusedNamespaces;

  beforeAll(() => {
    cleaner = new RemoveUnusedNamespaces();
  });

  test('remove unused namespaces on root', () => {
    const document = newDocumentContent(
      [
        '<r:root',
        '   xmlns:b="http://tempuri.org/bar"',
        '   xmlns:r="http://tempuri.org/root"',
        '   xmlns:f="http://tempuri.org/foo"',
        '/>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('remove unused namespaces on children', () => {
    const document = newDocumentContent(
      [
        '<r:root xmlns:b="http://tempuri.org/bar" xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
        '   <a:child xmlns:a="http://tempuri.org/a">',
        '       <a:child xmlns:xee="http://tempuri.org/xee" f:foo="foo"/>',
        '   </a:child>',
        '</r:root>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<r:root xmlns:r="http://tempuri.org/root" xmlns:f="http://tempuri.org/foo">',
        '   <a:child xmlns:a="http://tempuri.org/a">',
        '       <a:child f:foo="foo"/>',
        '   </a:child>',
        '</r:root>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('remove duplicated namespaces prefixes', () => {
    const document = newDocumentContent(
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

    const expected = newDocumentContent(
      [
        '<root:root',
        '  xmlns:root="http://tempuri.org/root"',
        '  xmlns:attr="http://tempuri.org/attributes">',
        '  <fine:child xmlns:fine="http://tempuri.org/namespace" attr:x="y"/>',
        '</root:root>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
