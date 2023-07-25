import { Xml, getSerializer } from '@nodecfdi/cfdiutils-common';
import { XmlStringCleaners } from './xml-string-cleaners';
import { XmlDocumentCleaners } from './xml-document-cleaners';
import { type ExcludeList } from './exclude-list';

export class Cleaner {
    private _stringCleaners: XmlStringCleaners;

    private _xmlCleaners: XmlDocumentCleaners;

    constructor(
        stringCleaners: XmlStringCleaners | null = null,
        xmlDocumentCleaners: XmlDocumentCleaners | null = null,
    ) {
        this._stringCleaners = stringCleaners ?? XmlStringCleaners.createDefault();
        this._xmlCleaners = xmlDocumentCleaners ?? XmlDocumentCleaners.createDefault();
    }

    public static staticClean(xml: string): string {
        return new Cleaner().cleanStringToString(xml);
    }

    public exclude(excludeList: ExcludeList): void {
        this._stringCleaners = this._stringCleaners.withOutCleaners(excludeList);
        this._xmlCleaners = this._xmlCleaners.withOutCleaners(excludeList);
    }

    public cleanString(xml: string): string {
        return this._stringCleaners.clean(xml);
    }

    public cleanDocument(document: Document): void {
        this._xmlCleaners.clean(document);
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
