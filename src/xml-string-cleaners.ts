import { type XmlStringCleanerInterface } from './xml-string-cleaner-interface';
import { RemoveNonXmlStrings } from './xml-string-cleaners/remove-non-xml-strings';
import { SplitXmlDeclarationFromDocument } from './xml-string-cleaners/split-xml-declaration-from-document';
import { AppendXmlDeclaration } from './xml-string-cleaners/append-xml-declaration';
import { XmlNsSchemaLocation } from './xml-string-cleaners/xml-ns-schema-location';

export class XmlStringCleaners implements XmlStringCleanerInterface {
    public static createDefault(): XmlStringCleaners {
        return new XmlStringCleaners(
            new RemoveNonXmlStrings(),
            new SplitXmlDeclarationFromDocument(),
            new AppendXmlDeclaration(),
            new XmlNsSchemaLocation()
        );
    }

    private readonly cleaners: XmlStringCleanerInterface[];

    constructor(...cleaners: XmlStringCleanerInterface[]) {
        this.cleaners = cleaners;
    }

    public clean(xml: string): string {
        for (const cleaner of this.cleaners) {
            xml = cleaner.clean(xml);
        }

        return xml;
    }
}
