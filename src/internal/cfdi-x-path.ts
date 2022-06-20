import { select, SelectedValue, useNamespaces } from 'xpath';
import { XmlConstants } from './xml-constants';

export class CfdiXPath {
    private readonly document: Document;
    private readonly namespaces?: Record<string, string>;

    constructor(document: Document, namespaces?: Record<string, string>) {
        this.document = document;
        this.namespaces = namespaces;
    }

    public static createFromDocument(document: Document): CfdiXPath {
        const root = document.documentElement;
        const rootAttribute = root.getAttributeNodeNS(XmlConstants.NAMESPACE_XMLNS, 'cfdi');
        const namespaceCfdi =
            rootAttribute?.nodeValue === 'http://www.sat.gob.mx/cfd/3'
                ? 'http://www.sat.gob.mx/cfd/3'
                : 'http://www.sat.gob.mx/cfd/4';

        const namespaces = {
            cfdi: namespaceCfdi,
            xsi: XmlConstants.NAMESPACE_XSI,
        };
        return new CfdiXPath(document, namespaces);
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
