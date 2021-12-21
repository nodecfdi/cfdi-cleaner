import 'jest-xml-matcher';
import { MoveSchemaLocationsToRoot } from '../../../src';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { XMLSerializer } from '@xmldom/xmldom';

describe('MoveSchemaLocationToRoot', () => {
    let cleaner: MoveSchemaLocationsToRoot;

    beforeAll(() => {
        cleaner = new MoveSchemaLocationsToRoot();
    });

    test('move schema locations to root', () => {
        const document = Xml.newDocumentContent(
            [
                '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ' xsi:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/bar bar.xsd">',
                '    <foo xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
                '        <bar xsi:schemaLocation="http://tempuri.org/foo foo.xsd http://tempuri.org/bar bar.xsd"/>',
                '    </foo>',
                '</root>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expectedLocations = [
            'http://tempuri.org/root root.xsd',
            'http://tempuri.org/bar bar.xsd',
            'http://tempuri.org/foo foo.xsd',
        ].join(' ');
        const expected = Xml.newDocumentContent(
            [
                '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                ` xsi:schemaLocation="${expectedLocations}">`,
                '   <foo>',
                '       <bar />',
                '   </foo>',
                '</root>',
            ].join('\n')
        );
        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('move schema locations to root with different prefix', () => {
        const document = Xml.newDocumentContent(
            [
                '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
                '   xs:schemaLocation="http://tempuri.org/root root.xsd">',
                '    <foo xs:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
                '</root>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<root xmlns:xs="http://www.w3.org/2001/XMLSchema-instance"',
                '  xs:schemaLocation="http://tempuri.org/root root.xsd http://tempuri.org/foo foo.xsd">',
                '   <foo/>',
                '</root>',
            ].join('\n')
        );
        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('move schema locations to root without root schema location', () => {
        const document = Xml.newDocumentContent(
            [
                '<root>',
                '    <foo xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '       xsi:schemaLocation="http://tempuri.org/foo foo.xsd"/>',
                '</root>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<root xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd">',
                '   <foo/>',
                '</root>',
            ].join('\n')
        );
        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });
});
