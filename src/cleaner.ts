import { XmlStringCleaners } from './xml-string-cleaners';
import { XmlDocumentCleaners } from './xml-document-cleaners';
import { Xml, getSerializer } from '@nodecfdi/cfdiutils-common';

export class Cleaner {
    private stringCleaners: XmlStringCleaners;

    private xmlCleaners: XmlDocumentCleaners;

    constructor(
        stringCleaners: XmlStringCleaners | null = null,
        xmlDocumentCleaners: XmlDocumentCleaners | null = null
    ) {
        this.stringCleaners = stringCleaners || XmlStringCleaners.createDefault();
        this.xmlCleaners = xmlDocumentCleaners || XmlDocumentCleaners.createDefault();
    }

    public static staticClean(xml: string): string {
        return new Cleaner().cleanStringToString(xml);
    }

    public cleanString(xml: string): string {
        return this.stringCleaners.clean(xml);
    }

    public cleanDocument(document: Document): void {
        this.xmlCleaners.clean(document);
    }

    public cleanStringToDocument(xml: string): Document {
        const xmlClean = this.cleanString(xml);
        const document = this.createDocument(xmlClean);
        this.cleanDocument(document);

        return document;
    }

    public cleanStringToString(xml: string): string {
        return getSerializer().serializeToString(this.cleanStringToDocument(xml));
    }

    protected createDocument(xml: string): Document {
        return Xml.newDocumentContent(xml);
    }
}
