import 'jest-xml-matcher';
import https from 'node:https';
import { getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import SetKnownSchemaLocations from '#src/xml_document_cleaners/set_known_schema_locations';

describe('set known schema locations', () => {
  let cleaner: SetKnownSchemaLocations;
  const fetch = async (
    urlOptions: string | https.RequestOptions | URL,
    data: unknown = '',
  ): Promise<{ statusCode: number; headers: unknown; body: string }> =>
    new Promise((resolve, reject) => {
      const request = https.request(urlOptions, (response) => {
        let body = '';
        response.on('data', (chunk: string) => {
          body += chunk.toString();
        });
        response.on('error', reject);
        response.on('end', () => {
          if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
            resolve({ statusCode: response.statusCode, headers: response.headers, body });
          } else {
            reject(
              new Error(`Request failed. status: ${response.statusCode ?? 500}, body: ${body}`),
            );
          }
        });
      });
      request.on('error', reject);
      request.write(data, 'binary');
      request.end();
    });

  beforeAll(() => {
    cleaner = new SetKnownSchemaLocations();
  });

  test('set known schema locations', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3"',
        '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"',
        '>',
        '   <cfdi:Complemento>',
        '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
        '           xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital tfd.xsd"',
        '       />',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const xsdCfd = 'http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd';
    const xsdTfd =
      'http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd';

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3"',
        '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        `   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 ${xsdCfd}"`,
        '>',
        '   <cfdi:Complemento>',
        '       <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" Version="1.1"',
        `           xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital ${xsdTfd}"`,
        '       />',
        '   </cfdi:Complemento>',
        '</cfdi:Comprobante>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('set known schema locations without version', () => {
    const document = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
        '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
        '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('set known schema locations with unknown namespace', () => {
    const document = newDocumentContent(
      [
        '<foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
      ].join('\n'),
    );

    cleaner.clean(document);

    const expected = newDocumentContent(
      [
        ' <foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
      ].join('\n'),
    );

    const xmlClean = getSerializer().serializeToString(document);
    const xmlExpected = getSerializer().serializeToString(expected);
    expect(xmlClean).toEqualXML(xmlExpected);
  });

  test('know_all_locations_from_sat_ns_registry', async () => {
    // Obtain the list of known locations from phpcfdi/sat-ns-registry
    const satNsRegistryUrl =
      'https://raw.githubusercontent.com/phpcfdi/sat-ns-registry/master/complementos_v1.json';

    const response = await fetch(satNsRegistryUrl);
    const registry = JSON.parse(response.body) as {
      namespace?: string;
      version?: string;
      xsd?: string;
    }[];

    // Re-creat the known list of namespace#version => xsd-location
    const expected: Record<string, string> = {};
    for (const entry of registry) {
      const namespace = entry.namespace ?? '';
      const version = entry.version ?? '';
      const xsd = entry.xsd ?? '';
      if (namespace && xsd) {
        expected[`${namespace}#${version}`] = xsd;
      }
    }

    const knownLocations = SetKnownSchemaLocations.getKnowNamespaces();

    expect(knownLocations).toStrictEqual(expected);
  });
});
