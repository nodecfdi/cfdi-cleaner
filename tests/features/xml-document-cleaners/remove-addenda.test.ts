import { Xml, install } from '@nodecfdi/cfdiutils-common';
import { DOMParser, XMLSerializer, DOMImplementation } from '@xmldom/xmldom';
import { RemoveAddenda } from '~/index';

describe('RemoveAddenda', () => {
    const providerCleanDocumentWithAddenda: [string, string, string][] = [
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
        install(new DOMParser(), new XMLSerializer(), new DOMImplementation());
    });

    test.each(providerCleanDocumentWithAddenda)('clean document with addenda %s', (_name, namespace, source) => {
        const document = Xml.newDocumentContent(source);

        const cleaner = new RemoveAddenda();
        cleaner.clean(document);
        // Addenda element should not exist after cleaning
        expect(Array.from(document.getElementsByTagNameNS(namespace, 'Addenda'))).toHaveLength(0);
    });
});
