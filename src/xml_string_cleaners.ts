import { type ExcludeList } from '#src/exclude_list';
import { type XmlStringCleanerInterface } from '#src/types';
import { AppendXmlDeclaration } from '#src/xml_string_cleaners/append_xml_declaration';
import { RemoveNonXmlStrings } from '#src/xml_string_cleaners/remove_non_xml_strings';
import { SplitXmlDeclarationFromDocument } from '#src/xml_string_cleaners/split_xml_declaration_from_document';
import { XmlNsSchemaLocation } from '#src/xml_string_cleaners/xml_ns_schema_location';

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
