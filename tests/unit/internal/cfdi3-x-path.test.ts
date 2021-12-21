import { Cfdi3XPath } from '../../../src/internal/cfdi3-x-path';
import { DomValidators, Xml } from '@nodecfdi/cfdiutils-common';

describe('Internal/Cfdi3XPath', () => {
    test('query elements on cfdi with complementos', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                ' <cfdi:Complemento>',
                '  <foo:Foo id="first" xmlns:foo="http://tempuri.org/foo">',
                '   <foo:Child/>',
                '  </foo:Foo>',
                ' </cfdi:Complemento>',
                ' <cfdi:Complemento>',
                '  <foo:Foo id="second" xmlns:foo="http://tempuri.org/foo">',
                '   <foo:Child/>',
                '  </foo:Foo>',
                ' </cfdi:Complemento>',
                ' <cfdi:Complemento>',
                '  <foo:Foo id="third" xmlns:foo="http://tempuri.org/foo">',
                '   <foo:Child/>',
                '  </foo:Foo>',
                ' </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n')
        );
        const xpath3 = Cfdi3XPath.createFromDocument(document);
        const complementos = xpath3.queryElements<Node>('/cfdi:Comprobante/cfdi:Complemento');
        expect(complementos).toHaveLength(3);
    });

    test('query attributes on cfdi', () => {
        const document = Xml.newDocumentContent(
            [
                '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xsi:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/bar bar.xsd">',
                ' <foo xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
                '  <bar xsi:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
                ' </foo>',
                '</root>',
            ].join('\n')
        );
        const xpath3 = Cfdi3XPath.createFromDocument(document);
        const schemaLocationAttributes = xpath3.queryAttributes<Attr>('//@xsi:schemaLocation');
        expect(schemaLocationAttributes).toHaveLength(3);
        schemaLocationAttributes.forEach((schemaLocationAttribute) => {
            expect(DomValidators.isAttr(schemaLocationAttribute)).toBeTruthy();
        });
    });
});
