import { Xml } from '@nodecfdi/cfdiutils-common';
import { RemoveAddenda } from '../../../src';

describe('RemoveAddenda', () => {
    let cleaner: RemoveAddenda;

    beforeAll(() => {
        cleaner = new RemoveAddenda();
    });

    test('clean document with addenda', () => {
        const document = Xml.newDocumentContent(
            [
                '<x:Comprobante xmlns:x="http://www.sat.gob.mx/cfd/3">',
                '   <x:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </x:Addenda>',
                '</x:Comprobante>',
            ].join('\n')
        );

        cleaner.clean(document);
        // Addenda element should not exist after cleaning
        expect(Array.from(document.getElementsByTagNameNS('http://www.sat.gob.mx/cfd/3', 'Addenda'))).toHaveLength(0);
    });
});
