import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { CollapseComplemento } from 'src/xml-document-cleaners/collapse-complemento';

describe('collapse_complemento_browser', () => {
    let cleaner: CollapseComplemento;

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        cleaner = new CollapseComplemento();
    });

    test('clean_non_cfdi_not_alter_document', () => {
        const _document = Xml.newDocumentContent(
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
        const xmlBeforeClean = new XMLSerializer().serializeToString(_document);

        cleaner.clean(_document);
        const xmlAfterClean = new XMLSerializer().serializeToString(_document);

        expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
    });

    test('clean_cfdi_with_just_one_complemento', () => {
        const _document = Xml.newDocumentContent(
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
        const xmlBeforeClean = new XMLSerializer().serializeToString(_document);

        cleaner.clean(_document);
        const xmlAfterClean = new XMLSerializer().serializeToString(_document);
        expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
    });

    test('clean_cfdi_with_three_complementos', () => {
        const _document = Xml.newDocumentContent(
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

        cleaner.clean(_document);
        const xmlClean = new XMLSerializer().serializeToString(_document);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
