import 'jest-xml-matcher';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import CollapseComplemento from '#src/xml_document_cleaners/collapse_complemento';

describe('collapse complemento', () => {
  let cleaner: CollapseComplemento;

  beforeAll(() => {
    cleaner = new CollapseComplemento();
  });

  test('clean non cfdi not alter document', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://tempuri.org/cfd">',
        '   <cfdi:Complemento>',
        '       <foo:Foo id="first" xmlns:foo="http://tempuri.org/foo">',
        '           <foo:Child/>',
        '       </foo:Foo>',
        '   </cfdi:Complemento>',
        '   <cfdi:Complemento>',
        '       <foo:Foo id="second" xmlns:foo="http://tempuri.org/foo">',
        '           <foo:Child/>',
        '       </foo:Foo>',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );
    const xmlBeforeClean = getSerializer().serializeToString(document);

    cleaner.clean(document);
    const xmlAfterClean = getSerializer().serializeToString(document);

    expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
  });

  test('clean cfdi with just one complemento', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
        '    <cfdi:Complemento>',
        '        <foo:Foo id="first" xmlns:foo="http://tempuri.org/foo">',
        '            <foo:Child/>',
        '        </foo:Foo>',
        '        <foo:Foo id="second" xmlns:foo="http://tempuri.org/foo">',
        '            <foo:Child/>',
        '        </foo:Foo>',
        '    </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );
    const xmlBeforeClean = getSerializer().serializeToString(document);

    cleaner.clean(document);
    const xmlAfterClean = getSerializer().serializeToString(document);
    expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
  });

  test('clean cfdi with three complementos', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4">',
        ' <cfdi:Complemento>',
        '   <foo:Foo id="first" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        ' </cfdi:Complemento>',
        ' <cfdi:Complemento />',
        ' <cfdi:Complemento>',
        '   <foo:Foo id="second" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        ' </cfdi:Complemento>',
        ' <cfdi:Complemento />',
        ' <cfdi:Complemento>',
        '   <foo:Foo id="third" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        ' </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join(''),
    );
    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4">',
        ' <cfdi:Complemento>',
        '   <foo:Foo id="first" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        '   <foo:Foo id="second" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        '   <foo:Foo id="third" xmlns:foo="http://tempuri.org/foo">',
        '     <foo:Child/>',
        '   </foo:Foo>',
        ' </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join(''),
    );

    const xmlExpected = getSerializer().serializeToString(expected);

    cleaner.clean(document);
    const xmlClean = getSerializer().serializeToString(document);

    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
