import { type XmlStringCleanerInterface } from '#src/types';

export default class SplitXmlDeclarationFromDocument implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    return xml.replaceAll(/(<\?xml.*?\?>)\s*</g, '$1\n<');
  }
}
