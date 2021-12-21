import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { select } from 'xpath';

interface RemoveUnusedNamespaces extends XmlNamespaceMethodsTrait {}

class RemoveUnusedNamespaces implements XmlDocumentCleanerInterface {
    @use(XmlNamespaceMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            this.checkNamespaceNode(document, namespaceNode);
        }
    }

    private checkNamespaceNode(document: Document, namespaceNode: Attr): void {
        const namespace = namespaceNode.nodeValue;
        if (this.hasElementsOnNamespace(document, namespace || '')) {
            return;
        }
        if (this.hasAttributesOnNamespace(document, namespace || '')) {
            return;
        }
        this.removeNamespaceNodeAttribute(namespaceNode);
    }

    private hasElementsOnNamespace(document: Document, namespace: string): boolean {
        const elements = select(`//*[namespace-uri()="${namespace}"]`, document);
        return elements.length > 0;
    }

    private hasAttributesOnNamespace(document: Document, namespace: string): boolean {
        const attributes = select(`//@*[namespace-uri()="${namespace}"]`, document);
        return attributes.length > 0;
    }
}

export { RemoveUnusedNamespaces };
