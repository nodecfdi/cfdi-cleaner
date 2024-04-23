import xpath from 'xpath';
import { Namespaces } from '../constants/namespaces.js';

export class CfdiXPath {
  private static readonly ALLOWED_NAMESPACES = [
    'http://www.sat.gob.mx/cfd/3',
    'http://www.sat.gob.mx/cfd/4',
  ];

  private readonly _document: Document;

  private readonly _namespaces?: Record<string, string>;

  public constructor(document: Document, namespaces?: Record<string, string>) {
    this._document = document;
    this._namespaces = namespaces;
  }

  public static createFromDocument(document: Document): CfdiXPath {
    const root = document.documentElement;
    let rootNamespace = root.namespaceURI ?? '';
    if (!this.ALLOWED_NAMESPACES.includes(rootNamespace)) {
      rootNamespace = '';
    }

    const namespaces = {
      cfdi: rootNamespace,
      xsi: Namespaces.NamespaceXsi,
    };

    return new CfdiXPath(document, namespaces);
  }

  public queryElements<T extends Element>(xpathQuery: string): T[] {
    return this.querySelect<T>(xpathQuery);
  }

  public queryAttributes<T extends Attr>(xpathQuery: string): T[] {
    return this.querySelect<T>(xpathQuery);
  }

  /**
   * Get all XMLSchema instance attributes schemaLocation
   *
   * @returns Attr[]
   */
  public querySchemaLocations(): Attr[] {
    return this.queryAttributes<Attr>('//@xsi:schemaLocation');
  }

  private querySelect<T extends xpath.SelectedValue>(xpathQuery: string): T[] {
    if (this._namespaces && Object.entries(this._namespaces).length > 0) {
      const selectWithNS = xpath.useNamespaces(this._namespaces);

      return selectWithNS(xpathQuery, this._document) as T[];
    }

    return xpath.select(xpathQuery, this._document) as T[];
  }
}
