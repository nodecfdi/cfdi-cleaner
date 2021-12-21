import { XmlStringCleanerInterface } from '../xml-string-cleaner-interface';

export class SplitXmlDeclarationFromDocument implements XmlStringCleanerInterface {
    public clean(xml: string): string {
        return xml.replace(/(<\?xml.*?\?>)([\s]*?)</gm, '$1\n<');
    }
}
