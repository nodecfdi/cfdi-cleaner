import { type XmlStringCleanerInterface } from '#src/types';

export default class XmlNsSchemaLocation implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    if (!xml.includes('xmlns:schemaLocation="')) {
      // Nothing to do
      return xml;
    }

    const pattern = /<[\s\S]*?>/gu;
    const matches = xml.matchAll(pattern).toArray();
    const parts = xml.split(pattern);

    const buffer = [parts[0]];
    for (const [index, match] of matches.entries()) {
      buffer.push(this.cleanTagContent(match[0]), parts[index + 1]);
    }

    return buffer.join('');
  }

  private cleanTagContent(content: string): string {
    if (!content.includes('xmlns:schemaLocation="')) {
      // Nothing to do
      return content;
    }

    if (!content.includes('xsi:schemaLocation="')) {
      // Safely replace to "xsi:schemaLocation"
      return content.replaceAll(/(\s)xmlns:schemaLocation="/g, '$1xsi:schemaLocation="');
    }

    // Remove xmlns:schemaLocation attribute
    return content.replaceAll(/\sxmlns:schemaLocation="[\s\S]*?"/g, '');
  }
}
