import { newDocumentContent } from '@nodecfdi/cfdi-core';
import RemoveAddenda from '#src/xml_document_cleaners/remove_addenda';

describe('remove addenda', () => {
  const providerCleanDocumentWithAddenda: [string, string, string][] = [
    [
      'CFDI 3.3',
      'http://www.sat.gob.mx/cfd/3',
      [
        '<x:Comprobante xmlns:x="http://www.sat.gob.mx/cfd/3">',
        '    <x:Addenda>',
        '        <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
        '    </x:Addenda>',
        '</x:Comprobante>',
      ].join('\n'),
    ],
    [
      'CFDI 4.0',
      'http://www.sat.gob.mx/cfd/4',
      [
        '<x:Comprobante xmlns:x="http://www.sat.gob.mx/cfd/4">',
        '   <x:Addenda>',
        '       <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
        '   </x:Addenda>',
        '</x:Comprobante>',
      ].join('\n'),
    ],
    [
      'RET 1.0',
      'http://www.sat.gob.mx/esquemas/retencionpago/1',
      [
        '<x:Retenciones xmlns:x="http://www.sat.gob.mx/esquemas/retencionpago/1">',
        '  <x:Addenda>',
        '    <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
        '  </x:Addenda>',
        '</x:Retenciones>',
      ].join('\n'),
    ],
    [
      'RET 2.0',
      'http://www.sat.gob.mx/esquemas/retencionpago/2',
      [
        '<x:Retenciones xmlns:x="http://www.sat.gob.mx/esquemas/retencionpago/2">',
        '  <x:Addenda>',
        '      <o:OtherData xmlns:o="http://tempuri.org/other" foo="bar" />',
        '  </x:Addenda>',
        '</x:Retenciones>',
      ].join('\n'),
    ],
  ];

  test.each(providerCleanDocumentWithAddenda)(
    'clean document with addenda %s',
    (_name, namespace, source) => {
      const document = newDocumentContent(source);

      const cleaner = new RemoveAddenda();
      cleaner.clean(document);
      // Addenda element should not exist after cleaning
      expect(document.getElementsByTagNameNS(namespace, 'Addenda')).toHaveLength(0);
    },
  );
});
