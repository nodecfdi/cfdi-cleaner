import { type XmlStringCleanerInterface } from '../types.js';

export class RemoveNonXmlStrings implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    const posFirstLessThan = xml.indexOf('<');
    if (posFirstLessThan === -1) {
      return '';
    }

    const posLastGreaterThan = xml.lastIndexOf('>');
    if (posLastGreaterThan === -1) {
      return '';
    }

    const length = posLastGreaterThan - posFirstLessThan + 1;

    if (length <= 0) {
      return '';
    }

    return xml.slice(posFirstLessThan, posFirstLessThan + length);
  }
}
