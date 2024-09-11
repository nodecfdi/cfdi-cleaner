import { type XmlStringCleanerInterface } from '#src/types';

export class AppendXmlDeclaration implements XmlStringCleanerInterface {
  public clean(xml: string): string {
    let xmlResult = xml;

    if (!xmlResult.startsWith('<?xml ')) {
      xmlResult = `<?xml version="1.0"?>\n${xmlResult}`;
    }

    return xmlResult;
  }
}
