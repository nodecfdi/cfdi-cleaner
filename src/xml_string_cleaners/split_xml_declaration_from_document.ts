import { type XmlStringCleanerInterface } from '../types.js';

export class SplitXmlDeclarationFromDocument implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    return xml.replaceAll(/(<\?xml.*?\?>)\s*</g, '$1\n<');
  }
}
