import 'jest-xml-matcher';
import { install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { Cleaner } from '~/cleaner';
import { ExcludeList } from '~/exclude-list';
import { MoveNamespaceDeclarationToRoot } from '~/xml-document-cleaners/move-namespace-declaration-to-root';
import { RemoveAddenda } from '~/xml-document-cleaners/remove-addenda';
import { RemoveNonSatNamespacesNodes } from '~/xml-document-cleaners/remove-non-sat-namespaces-nodes';
import { RemoveNonSatSchemaLocations } from '~/xml-document-cleaners/remove-non-sat-schema-locations';

describe('Cleanes_Exclude', () => {
    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test('cleaner exclude addenda', () => {
        const xml = [
            '<?xml version="1.0"?>',
            '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
            ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
            ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
            ' Version="4.0">',
            '<cfdi:Addenda>',
            '    <foo:Main id="1" xmlns:foo="urn:foo"/>',
            '</cfdi:Addenda>',
            '</cfdi:Comprobante>'
        ].join('');

        const excludeList = new ExcludeList(
            RemoveAddenda,
            RemoveNonSatNamespacesNodes,
            RemoveNonSatSchemaLocations,
            MoveNamespaceDeclarationToRoot
        );

        const cleaner = new Cleaner();
        cleaner.exclude(excludeList);

        const xmlClean = cleaner.cleanStringToString(xml);
        expect(xmlClean).toEqualXML(xml);
    });
});
