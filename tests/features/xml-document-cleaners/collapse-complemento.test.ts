import 'jest-xml-matcher';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { XMLSerializer } from '@xmldom/xmldom';
import { CollapseComplemento } from '../../../src';

describe('CollapseComplemento', () => {
    let cleaner: CollapseComplemento;

    beforeAll(() => {
        cleaner = new CollapseComplemento();
    });

    test('clean non cfdi not alter document', () => {
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
            ].join('\n')
        );
        const xmlBeforeClean = new XMLSerializer().serializeToString(document);

        cleaner.clean(document);
        const xmlAfterClean = new XMLSerializer().serializeToString(document);

        expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
    });

    test('clean cfdi with just one complemento', () => {
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
            ].join('\n')
        );
        const xmlBeforeClean = new XMLSerializer().serializeToString(document);

        cleaner.clean(document);
        const xmlAfterClean = new XMLSerializer().serializeToString(document);
        expect(xmlAfterClean).toEqualXML(xmlBeforeClean);
    });

    test('clean cfdi with three complementos', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
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
            ].join('')
        );
        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
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
            ].join('')
        );

        const xmlExpected = new XMLSerializer().serializeToString(expected);

        cleaner.clean(document);
        const xmlClean = new XMLSerializer().serializeToString(document);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
