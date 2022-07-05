import { select, SelectedValue, useNamespaces } from 'xpath';
import { XmlConstants } from './xml-constants';

export class CfdiXPath {
    private static ALLOWED_NAMESPACES = ['http://www.sat.gob.mx/cfd/3', 'http://www.sat.gob.mx/cfd/4'];

    private readonly document: Document;

    private readonly namespaces?: Record<string, string>;

    constructor(document: Document, namespaces?: Record<string, string>) {
        this.document = document;
        this.namespaces = namespaces;
    }

    public static createFromDocument(document: Document): CfdiXPath {
        const root = document.documentElement;
        let rootNamespace = root.namespaceURI || '';
        if (!this.ALLOWED_NAMESPACES.includes(rootNamespace)) {
            rootNamespace = '';
        }

        const namespaces = {
            cfdi: rootNamespace,
            xsi: XmlConstants.NAMESPACE_XSI
        };

        return new CfdiXPath(document, namespaces);
    }

    private querySelect<T extends SelectedValue>(xpathQuery: string): T[] {
        if (this.namespaces && this.namespaces !== {}) {
            const selectWithNS = useNamespaces(this.namespaces);

            return selectWithNS(xpathQuery, this.document) as T[];
        }

        return select(xpathQuery, this.document) as T[];
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
}
