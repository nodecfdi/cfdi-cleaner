/**
 * \@vitest-environment jsdom
 */

import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { RemoveAddenda } from '~/xml-document-cleaners/remove-addenda';

describe('RemoveAddenda_Browser', () => {
    const providerCleanDocumentWithAddenda: Array<[string, string, string]> = [
        [
            'CFDI 3.3',
            'http://www.sat.gob.mx/cfd/3',
            [
                '<x:Comprobante xmlns:x="http://www.sat.gob.mx/cfd/3">',
                '    <x:Addenda>',
                '        <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '    </x:Addenda>',
                '</x:Comprobante>'
            ].join('\n')
        ],
        [
            'CFDI 4.0',
            'http://www.sat.gob.mx/cfd/4',
            [
                '<x:Comprobante xmlns:x="http://www.sat.gob.mx/cfd/4">',
                '   <x:Addenda>',
                '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
                '   </x:Addenda>',
                '</x:Comprobante>'
            ].join('\n')
        ]
    ];

    beforeAll(() => {
        install(new DOMParser(), new XMLSerializer(), document.implementation);
    });

    test.each(providerCleanDocumentWithAddenda)('clean document with addenda %s', (_name, namespace, source) => {
        const _document = Xml.newDocumentContent(source);

        const cleaner = new RemoveAddenda();
        cleaner.clean(_document);
        // Addenda element should not exist after cleaning
        // eslint-disable-next-line unicorn/prefer-spread
        expect(Array.from(_document.getElementsByTagNameNS(namespace, 'Addenda'))).toHaveLength(0);
    });
});
