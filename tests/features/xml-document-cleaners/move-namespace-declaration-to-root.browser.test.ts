/**
 * \@vitest-environment jsdom
 */

import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { MoveNamespaceDeclarationToRoot } from 'src/xml-document-cleaners/move-namespace-declaration-to-root';

describe('MoveNamespaceDeclarationToRoot_Browser', () => {
    let cleaner: MoveNamespaceDeclarationToRoot;

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
        cleaner = new MoveNamespaceDeclarationToRoot();
    });

    test('move namespace declaration to root', () => {
        const _document = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root">',
                '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
                '   <bar:bar xmlns:bar="http://tempuri.org/bar"/>',
                '   <xee/>',
                '</r:root>',
            ].join('\n'),
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" xmlns:foo="http://tempuri.org/foo" xmlns:bar="http://tempuri.org/bar">',
                '   <foo:foo/>',
                '   <bar:bar/>',
                '   <xee/>',
                '</r:root>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('move namespace declaration to root with overlapped namespaces different', () => {
        const _document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                '   <cfdi:Complemento>',
                '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro" />',
                '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" />',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n'),
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">',
                '   <cfdi:Complemento>',
                '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro"/>',
                '       <tfd:TimbreFiscalDigital/>',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('move namespace declaration to root with overlapped namespaces equal', () => {
        const _document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                '   <cfdi:Complemento xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                '       <otro:Otro xmlns:otro="http://www.sat.gob.mx/otro" />',
                '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" />',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n'),
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
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

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
