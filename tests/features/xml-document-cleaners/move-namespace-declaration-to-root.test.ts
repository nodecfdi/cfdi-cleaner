import 'jest-xml-matcher';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { MoveNamespaceDeclarationToRoot } from '../../../src';
import { XMLSerializer } from '@xmldom/xmldom';

describe('MoveNamespaceDeclarationToRoot', () => {
    let cleaner: MoveNamespaceDeclarationToRoot;

    beforeAll(() => {
        cleaner = new MoveNamespaceDeclarationToRoot();
    });

    test('move namespace declaration to root', () => {
        const document = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root">',
                '   <foo:foo xmlns:foo="http://tempuri.org/foo"/>',
                '   <bar:bar xmlns:bar="http://tempuri.org/bar"/>',
                '   <xee/>',
                '</r:root>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" xmlns:foo="http://tempuri.org/foo" xmlns:bar="http://tempuri.org/bar">',
                '   <foo:foo/>',
                '   <bar:bar/>',
                '   <xee/>',
                '</r:root>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('move namespace declaration to root with overlapped namespaces', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3">',
                '   <cfdi:Complemento>',
                '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro" />',
                '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" />',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">',
                '   <cfdi:Complemento>',
                '       <cfdi:Otro xmlns:cfdi="http://www.sat.gob.mx/otro"/>',
                '       <tfd:TimbreFiscalDigital/>',
                '   </cfdi:Complemento>',
                '</cfdi:Comprobante>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
