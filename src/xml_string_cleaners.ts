import { type ExcludeList } from './exclude_list.js';
import { type XmlStringCleanerInterface } from './types.js';
import { AppendXmlDeclaration } from './xml_string_cleaners/append_xml_declaration.js';
import { RemoveNonXmlStrings } from './xml_string_cleaners/remove_non_xml_strings.js';
import { SplitXmlDeclarationFromDocument } from './xml_string_cleaners/split_xml_declaration_from_document.js';
import { XmlNsSchemaLocation } from './xml_string_cleaners/xml_ns_schema_location.js';

export class XmlStringCleaners implements XmlStringCleanerInterface {
  private readonly cleaners: XmlStringCleanerInterface[];

  public constructor(...cleaners: XmlStringCleanerInterface[]) {
    this.cleaners = cleaners;
  }

  public static createDefault(): XmlStringCleaners {
    return new XmlStringCleaners(
      new RemoveNonXmlStrings(),
      new SplitXmlDeclarationFromDocument(),
      new AppendXmlDeclaration(),
      new XmlNsSchemaLocation(),
    );
  }

  public clean(xml: string): string {
    let xmlResult = xml;
    for (const cleaner of this.cleaners) {
      xmlResult = cleaner.clean(xmlResult);
    }

    return xmlResult;
  }

  public withOutCleaners(excludeList: ExcludeList): XmlStringCleaners {
    const cleaners = excludeList.filterObjects(...this.cleaners);

    return new XmlStringCleaners(...cleaners);
  }
}
