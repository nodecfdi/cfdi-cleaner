import { XmlStringCleanerInterface } from '../xml-string-cleaner-interface';

export class AppendXmlDeclaration implements XmlStringCleanerInterface {
    public clean(xml: string): string {
        if (!xml.startsWith('<?xml ')) {
            xml = `<?xml version="1.0"?>\n${xml}`;
        }
        return xml;
    }
}
