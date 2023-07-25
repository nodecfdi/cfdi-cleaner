import 'jest-xml-matcher';
import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { RenameElementAddPrefix } from 'src/xml-document-cleaners/rename-element-add-prefix';

describe('remove_element_add_prefix_browser', () => {
    const cleaner = new RenameElementAddPrefix();

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
    });

    test('rename_element_add_prefix', () => {
        // NOTICE:
        // - no prefix definition *before* prefixed definition on root
        // - first element is not prefixed
        // - second element is prefixed but contains superfluous declaration
        // - third element is prefixed but contains unused declaration
        const _document = Xml.newDocumentContent(
            [
                '<r:root xmlns="http://tempuri.org/root" xmlns:r="http://tempuri.org/root" id="0">',
                '  <first xmlns="http://tempuri.org/root" id="1" />',
                '  <r:second xmlns:r="http://tempuri.org/root" id="2" />',
                '  <r:third xmlns="http://tempuri.org/root" id="3" />',
                '</r:root>',
            ].join('\n'),
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(
            [
                '<r:root xmlns:r="http://tempuri.org/root" id="0">',
                '  <r:first id="1" />',
                '  <r:second id="2" />',
                '  <r:third id="3" />',
                '</r:root>',
            ].join('\n'),
        );

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove_duplicated_namespace_as_default', () => {
        const _document = Xml.newDocumentContent(
            ['<r:root xmlns:r="http://tempuri.org/root" xmlns="http://www.sat.gob.mx/cfd/3"/>'].join('\n'),
        );

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('remove_empty_namespace_without_prefix', () => {
        const _document = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root" xmlns=""/>'].join('\n'));

        cleaner.clean(_document);

        const expected = Xml.newDocumentContent(['<r:root xmlns:r="http://tempuri.org/root"/>'].join('\n'));

        const xmlClean = new XMLSerializer().serializeToString(_document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);

        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
