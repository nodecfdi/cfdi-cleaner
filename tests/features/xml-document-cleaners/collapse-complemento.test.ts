import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { CollapseComplemento } from 'src/xml-document-cleaners/collapse-complemento';

describe('collapse_complemento', () => {
  let cleaner: CollapseComplemento;

  beforeAll(() => {
    install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    cleaner = new CollapseComplemento();
  });

  test('clean_non_cfdi_not_alter_document', () => {
    const document = Xml.newDocumentContent(
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
    const xmlBeforeClean = new XMLSerializer().serializeToString(document);

    cleaner.clean(document);
    const xmlAfterClean = new XMLSerializer().serializeToString(document);

    expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
  });

  test('clean_cfdi_with_just_one_complemento', () => {
    const document = Xml.newDocumentContent(
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
    const xmlBeforeClean = new XMLSerializer().serializeToString(document);

    cleaner.clean(document);
    const xmlAfterClean = new XMLSerializer().serializeToString(document);
    expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
  });

  test('clean_cfdi_with_three_complementos', () => {
    const document = Xml.newDocumentContent(
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
    const expected = Xml.newDocumentContent(
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

    const xmlExpected = new XMLSerializer().serializeToString(expected);

    cleaner.clean(document);
    const xmlClean = new XMLSerializer().serializeToString(document);

    expect(xmlClean).toEqualXML(xmlExpected);
  });
});
