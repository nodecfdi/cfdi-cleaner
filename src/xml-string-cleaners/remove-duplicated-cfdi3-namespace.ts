import { XmlStringCleanerInterface } from '../xml-string-cleaner-interface';

export class RemoveDuplicatedCfdi3Namespace implements XmlStringCleanerInterface {
    public clean(xml: string): string {
        if (
            xml.includes('xmlns="http://www.sat.gob.mx/cfd/3"') &&
            xml.includes('xmlns:cfdi="http://www.sat.gob.mx/cfd/3"')
        ) {
            xml = xml.replace(/\s*xmlns="http:\/\/www.sat.gob.mx\/cfd\/3"\s*/g, ' ');
        }
        return xml;
    }
}
