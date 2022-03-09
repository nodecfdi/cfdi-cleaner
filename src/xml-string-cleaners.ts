import { XmlStringCleanerInterface } from './xml-string-cleaner-interface';
import { RemoveNonXmlStrings } from './xml-string-cleaners/remove-non-xml-strings';
import { SplitXmlDeclarationFromDocument } from './xml-string-cleaners/split-xml-declaration-from-document';
import { AppendXmlDeclaration } from './xml-string-cleaners/append-xml-declaration';
import { XmlNsSchemaLocation } from './xml-string-cleaners/xml-ns-schema-location';

export class XmlStringCleaners implements XmlStringCleanerInterface {
    private cleaners: XmlStringCleanerInterface[];

    constructor(...cleaners: XmlStringCleanerInterface[]) {
        this.cleaners = cleaners;
    }

    public static createDefault(): XmlStringCleaners {
        return new XmlStringCleaners(
            ...[
                new RemoveNonXmlStrings(),
                new SplitXmlDeclarationFromDocument(),
                new AppendXmlDeclaration(),
                new XmlNsSchemaLocation(),
            ]
        );
    }

    public clean(xml: string): string {
        this.cleaners.forEach((cleaner) => {
            xml = cleaner.clean(xml);
        });
        return xml;
    }
}
