import { type XmlStringCleanerInterface } from '../xml-string-cleaner-interface';

export class SplitXmlDeclarationFromDocument implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    return xml.replaceAll(/(<\?xml.*?\?>)(\s*?)</gm, '$1\n<');
  }
}
