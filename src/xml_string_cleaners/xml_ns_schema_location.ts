import { type XmlStringCleanerInterface } from '../types.js';

export class XmlNsSchemaLocation implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    return xml.replaceAll(/(\s)xmlns:schemaLocation="/g, '$1xsi:schemaLocation="');
  }
}
