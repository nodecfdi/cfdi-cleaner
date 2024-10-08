import { type Document, getSerializer, newDocumentContent } from '@nodecfdi/cfdi-core';
import type ExcludeList from '#src/exclude_list';
import XmlDocumentCleaners from '#src/xml_document_cleaners';
import XmlStringCleaners from '#src/xml_string_cleaners';

export default class Cleaner {
  private _stringCleaners: XmlStringCleaners;

  private _xmlCleaners: XmlDocumentCleaners;

  public constructor(
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
    return newDocumentContent(xml);
  }
}
