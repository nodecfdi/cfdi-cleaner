import { select, SelectedValue, useNamespaces } from 'xpath';
import { XmlConstants } from './xml-constants';

export class Cfdi3XPath {
    private readonly document: Document;
    private readonly namespaces?: Record<string, string>;

    constructor(document: Document, namespaces?: Record<string, string>) {
        this.document = document;
        this.namespaces = namespaces;
    }

    public static createFromDocument(document: Document): Cfdi3XPath {
        const namespaces = {
            cfdi: 'http://www.sat.gob.mx/cfd/3',
            xsi: XmlConstants.NAMESPACE_XSI,
        };
        return new Cfdi3XPath(document, namespaces);
    }

    public queryElements<T extends SelectedValue>(xpathQuery: string): T[] {
        if (this.namespaces && this.namespaces !== {}) {
            const selectWithNS = useNamespaces(this.namespaces);
            return selectWithNS(xpathQuery, this.document) as T[];
        }
        return select(xpathQuery, this.document) as T[];
    }

    public queryAttributes<T extends SelectedValue>(xpathQuery: string): T[] {
        if (this.namespaces && this.namespaces !== {}) {
            const selectWithNS = useNamespaces(this.namespaces);
            return selectWithNS(xpathQuery, this.document) as T[];
        }
        return select(xpathQuery, this.document) as T[];
    }
}
