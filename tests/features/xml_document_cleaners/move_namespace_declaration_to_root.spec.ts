import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import MoveNamespaceDeclarationToRoot from '#src/xml_document_cleaners/move_namespace_declaration_to_root';

describe('move namespace declaration to root', () => {
  let cleaner: MoveNamespaceDeclarationToRoot;

  beforeAll(() => {
    cleaner = new MoveNamespaceDeclarationToRoot();
  });

  test('move namespace declaration to root', () => {
    const document = newDocumentContent(
      [
        '<r:root xmlns:r="http://tempuri.org/root">',
        '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
        '   <bar:bar xmlns:bar="http://tempuri.org/bar"/>',
        '   <xee/>',
        '</r:root>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<r:root xmlns:r="http://tempuri.org/root" xmlns:foo="http://tempuri.org/foo" xmlns:bar="http://tempuri.org/bar">',
        '   <foo:foo/>',
        '   <bar:bar/>',
        '   <xee/>',
        '</r:root>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);

    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move namespace declaration to root with overlapped namespaces different', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
        '   <cfdi:Complemento>',
        '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro" />',
        '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" />',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">',
        '   <cfdi:Complemento>',
        '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro"/>',
        '       <tfd:TimbreFiscalDigital/>',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);

    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('move namespace declaration to root with overlapped namespaces equal', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
        '   <cfdi:Complemento xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
        '       <otro:Otro xmlns:otro="http://www.sat.gob.mx/otro" />',
        '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" />',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante',
        '   xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
        '   xmlns:otro="http://www.sat.gob.mx/otro"',
        '   xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">',
        '   <cfdi:Complemento>',
        '       <otro:Otro />',
        '       <tfd:TimbreFiscalDigital />',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);

    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
