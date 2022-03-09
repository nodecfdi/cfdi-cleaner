import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';

interface RenameElementAddPrefix extends XmlNamespaceMethodsTrait {}

class RenameElementAddPrefix implements XmlDocumentCleanerInterface {
    @use(XmlNamespaceMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const rootElement = document.documentElement;
        if (!rootElement) {
            return;
        }

        // remove unused xmlns declarations
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            // remove xmlns only
            if ('xmlns' === namespaceNode.nodeName) {
                this.removeNamespaceNodeAttribute(namespaceNode);
            }

            // remove namespace prefix
            if (
                namespaceNode.ownerElement &&
                namespaceNode.ownerElement !== rootElement &&
                '' !== this.queryPrefix(namespaceNode.ownerElement)
            ) {
                this.removeNamespaceNodeAttribute(namespaceNode);
            }
        }
    }

    private queryPrefix(element: Element): string {
        const namespace = element.namespaceURI || '';
        if ('' === namespace) {
            return '';
        }

        const document = element.ownerDocument;
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            if (element !== namespaceNode.ownerElement) {
                continue;
            }

            const prefix = namespaceNode.localName || '';
            if ('' !== prefix && namespaceNode.nodeValue === namespace) {
                return prefix;
            }
        }

        return '';
    }
}

export { RenameElementAddPrefix };
