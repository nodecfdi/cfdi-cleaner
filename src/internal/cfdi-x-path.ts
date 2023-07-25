import xpath from 'xpath';
import { XmlConstants } from './xml-constants';

export class CfdiXPath {
    private static readonly ALLOWED_NAMESPACES = ['http://www.sat.gob.mx/cfd/3', 'http://www.sat.gob.mx/cfd/4'];

    private readonly _document: Document;

    private readonly _namespaces?: Record<string, string>;

    constructor(document: Document, namespaces?: Record<string, string>) {
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
            xsi: XmlConstants.NAMESPACE_XSI,
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
            // eslint-disable-next-line import/no-named-as-default-member
            const selectWithNS = xpath.useNamespaces(this._namespaces);

            return selectWithNS(xpathQuery, this._document) as T[];
        }

        // eslint-disable-next-line import/no-named-as-default-member
        return xpath.select(xpathQuery, this._document) as T[];
    }
}
