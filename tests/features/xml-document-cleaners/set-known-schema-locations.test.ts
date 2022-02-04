import 'jest-xml-matcher';
import { Xml } from '@nodecfdi/cfdiutils-common';
import { SetKnownSchemaLocations } from '../../../src';
import { XMLSerializer } from '@xmldom/xmldom';
import * as https from 'https';

describe('SetKnownSchemaLocations', () => {
    let cleaner: SetKnownSchemaLocations;

    beforeAll(() => {
        cleaner = new SetKnownSchemaLocations();
    });

    test('set known schema locations', () => {
        const document = Xml.newDocumentContent(
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
            ].join('\n')
        );

        cleaner.clean(document);

        const xsdCfd = 'http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd';
        const xsdTfd = 'http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd';

        const expected = Xml.newDocumentContent(
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
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('set known schema locations without version', () => {
        const document = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                '<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3"',
                '   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://www.sat.gob.mx/cfd/3 cfdi.xsd"/>',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('set known schema locations with unknown namespace', () => {
        const document = Xml.newDocumentContent(
            [
                '<foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
            ].join('\n')
        );

        cleaner.clean(document);

        const expected = Xml.newDocumentContent(
            [
                ' <foo:Foo xmlns:foo="http://tempuri.org/foo" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
                '   xsi:schemaLocation="http://tempuri.org/foo foo.xsd" />',
            ].join('\n')
        );

        const xmlClean = new XMLSerializer().serializeToString(document);
        const xmlExpected = new XMLSerializer().serializeToString(expected);
        expect(xmlClean).toEqualXML(xmlExpected);
    });

    test('know all locations from sat ns registry', () => {
        // obtain the list of known locations from phpcfdi/sat-ns-registry
        const satNsRegistryUrl =
            'https://raw.githubusercontent.com/phpcfdi/sat-ns-registry/master/complementos_v1.json';
        const fetch = (
            urlOptions: string | https.RequestOptions | URL,
            data: unknown = ''
        ): Promise<{ statusCode: number; headers: unknown; body: string }> => {
            return new Promise((resolve, reject) => {
                const req = https.request(urlOptions, (res) => {
                    let body = '';
                    res.on('data', (chunk) => (body += chunk.toString()));
                    res.on('error', reject);
                    res.on('end', () => {
                        if (res.statusCode && res.statusCode >= 200 && res.statusCode <= 299) {
                            resolve({ statusCode: res.statusCode, headers: res.headers, body: body });
                        } else {
                            reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
                        }
                    });
                });
                req.on('error', reject);
                req.write(data, 'binary');
                req.end();
            });
        };

        return fetch(satNsRegistryUrl).then((res) => {
            const registry = JSON.parse(res.body) as { namespace?: string; version?: string; xsd?: string }[];

            // re-creat the known list of namespace#version => xsd-location
            const expected: Record<string, string> = {};
            registry.forEach((entry) => {
                const namespace = entry.namespace ?? '';
                const version = entry.version ?? '';
                const xsd = entry.xsd ?? '';
                if (namespace && xsd) {
                    expected[`${namespace}#${version}`] = xsd;
                }
            });

            const knownLocations = SetKnownSchemaLocations.getKnowNamespaces();

            expect(knownLocations).toStrictEqual(expected);
        });
    });
});
