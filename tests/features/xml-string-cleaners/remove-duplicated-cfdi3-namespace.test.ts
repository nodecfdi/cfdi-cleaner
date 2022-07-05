import { RemoveDuplicatedCfdi3Namespace } from '~/index';

describe('RemoveDuplicatedCfdi3Namespace', () => {
    const xmlnsCfdi = 'xmlns:cfdi="http://www.sat.gob.mx/cfd/3"';
    const xmlns = 'xmlns="http://www.sat.gob.mx/cfd/3"';

    test.each([
        ['at middle', `<cfdi:Comprobante ${xmlnsCfdi}/>`, `<cfdi:Comprobante ${xmlns} ${xmlnsCfdi}/>`],
        ['multiple spaces', `<cfdi:Comprobante ${xmlnsCfdi}/>`, `<cfdi:Comprobante \t ${xmlns} \r\n ${xmlnsCfdi}/>`],
        [
            'at end',
            `<cfdi:Comprobante ${xmlnsCfdi} />`, // is replaced to a single space
            `<cfdi:Comprobante ${xmlnsCfdi} ${xmlns}/>`
        ]
    ])('clean %s', (_name, _expected, input) => {
        const warnMock = jest.spyOn(console, 'warn').mockImplementation();
        const cleaner = new RemoveDuplicatedCfdi3Namespace();
        const clean = cleaner.clean(input);
        expect(warnMock).toHaveBeenCalledTimes(1);
        expect(clean).toBe(input);
        warnMock.mockRestore();
    });
});
