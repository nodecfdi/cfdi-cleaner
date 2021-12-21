import { RemoveDuplicatedCfdi3Namespace } from '../../../src';

describe('RemoveDuplicatedCfdi3Namespace', () => {
    const xmlnsCfdi = 'xmlns:cfdi="http://www.sat.gob.mx/cfd/3"';
    const xmlns = 'xmlns="http://www.sat.gob.mx/cfd/3"';

    test.each([
        ['at middle', `<cfdi:Comprobante ${xmlnsCfdi}/>`, `<cfdi:Comprobante ${xmlns} ${xmlnsCfdi}/>`],
        ['multiple spaces', `<cfdi:Comprobante ${xmlnsCfdi}/>`, `<cfdi:Comprobante \t ${xmlns} \r\n ${xmlnsCfdi}/>`],
        [
            'at end',
            `<cfdi:Comprobante ${xmlnsCfdi} />`, // is replaced to a single space
            `<cfdi:Comprobante ${xmlnsCfdi} ${xmlns}/>`,
        ],
    ])('clean %s', (name, expected, input) => {
        const cleaner = new RemoveDuplicatedCfdi3Namespace();
        const clean = cleaner.clean(input);
        expect(clean).toBe(expected);
    });
});
