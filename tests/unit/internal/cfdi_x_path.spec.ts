import { newDocumentContent } from '@nodecfdi/cfdi-core';
import CfdiXPath from '#src/internal/cfdi_x_path';

describe('internal cfdi3_xpath', () => {
  const providerCreateCfdiVersions: readonly [string, string][] = [
    [
      'CFDI33',
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3"',
        '  xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        '  x:schemaLocation="http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd"',
        '>',
        '<cfdi:Complemento>',
        '  <leyendasFisc:LeyendasFiscales xmlns:leyendasFisc="http://www.sat.gob.mx/leyendasFiscales"',
        '   Version="1.0" x:schemaLocation="http://www.sat.gob.mx/leyendasFiscales leyendasFisc.xsd"',
        '  >',
        '    <leyendasFisc:Leyenda disposicionFiscal="RESDERAUTH" norma="Art 2. Fracc. IV." textoLeyenda="..." />',
        '  </leyendasFisc:LeyendasFiscales>',
        '</cfdi:Complemento>',
        '<cfdi:Complemento>',
        '  <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
        '    x:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital TimbreFiscalDigitalv11.xsd"',
        '    UUID="AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE" NoCertificadoSAT="00001000000504465028"',
        '    FechaTimbrado="2022-01-12T12:39:34" RfcProvCertif="SAT970701NN3"',
        '    SelloCFD="...5tSZhA==" SelloSAT="...aobTwQ=="/>',
        '</cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    ],
    [
      'CFDI40',
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" Version="4.0"',
        '  xmlns:x="http://www.w3.org/2001/XMLSchema-instance"',
        '  x:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
        '>',
        '<cfdi:Complemento>',
        '  <leyendasFisc:LeyendasFiscales xmlns:leyendasFisc="http://www.sat.gob.mx/leyendasFiscales"',
        '   Version="1.0" x:schemaLocation="http://www.sat.gob.mx/leyendasFiscales leyendasFisc.xsd"',
        '  >',
        '    <leyendasFisc:Leyenda disposicionFiscal="RESDERAUTH" norma="Art 2. Fracc. IV." textoLeyenda="..." />',
        '  </leyendasFisc:LeyendasFiscales>',
        '</cfdi:Complemento>',
        '<cfdi:Complemento>',
        '  <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
        '    x:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital TimbreFiscalDigitalv11.xsd"',
        '    UUID="AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE" NoCertificadoSAT="00001000000504465028"',
        '    FechaTimbrado="2022-01-12T12:39:34" RfcProvCertif="SAT970701NN3"',
        '    SelloCFD="...5tSZhA==" SelloSAT="...aobTwQ=="/>',
        '</cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    ],
  ];

  test.each(providerCreateCfdiVersions)('create cfdi versions %s', (_name, source) => {
    const document = newDocumentContent(source);
    const xpath = CfdiXPath.createFromDocument(document);

    const attributes: string[] = [];
    for (const attribute of xpath.queryAttributes('//cfdi:Complemento//@Version')) {
      attributes.push(attribute.nodeValue ?? '');
    }

    expect(attributes).toStrictEqual(['1.0', '1.1']);

    const elements = [];
    for (const element of xpath.queryElements('/cfdi:Comprobante/cfdi:Complemento/*')) {
      elements.push(element.nodeName);
    }

    expect(elements).toStrictEqual(['leyendasFisc:LeyendasFiscales', 'tfd:TimbreFiscalDigital']);

    expect(xpath.querySchemaLocations()).toHaveLength(3);

    expect(xpath.queryAttributes('//@FOOBAR')).toStrictEqual([]);
    expect(xpath.queryElements('//FOOBAR')).toStrictEqual([]);
  });

  test('non allowed namespace', () => {
    const document = newDocumentContent(
      ['<cfdi:Comprobante xmlns:cfdi="http://tempuri.org/cfdi"/>'].join('\n'),
    );

    const xpath = CfdiXPath.createFromDocument(document);
    expect(xpath.queryElements('/cfdi:Comprobante')).toHaveLength(0);
  });

  test('allowed namespace with different prefix', () => {
    const document = newDocumentContent(
      ['<factura:Comprobante xmlns:factura="http://www.sat.gob.mx/cfd/4"/>'].join('\n'),
    );

    const xpath = CfdiXPath.createFromDocument(document);
    expect(xpath.queryElements('/cfdi:Comprobante')).toHaveLength(1);
  });

  test('allowed work with no namespace definition', () => {
    const document = newDocumentContent('<book><title>Facturación</title></book>');
    const xpath = new CfdiXPath(document);

    expect(xpath.queryElements('//title')).toHaveLength(1);
  });
});
