import { Mixin } from 'ts-mixer';
import { select } from 'xpath';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';

class RemoveUnusedNamespaces extends Mixin(XmlNamespaceMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            this.checkNamespaceNode(document, namespaceNode);
        }
    }

    private checkNamespaceNode(document: Document, namespaceNode: Attr): void {
        const namespace = namespaceNode.nodeValue;
        if (namespace === null) {
            return;
        }

        const localName = '' !== namespaceNode.localName ? namespaceNode.localName + ':' : '';
        if (!this.isPrefixedNamespaceOnUse(document, namespace, localName)) {
            this.removeNamespaceNodeAttribute(namespaceNode);
        }
    }

    private isPrefixedNamespaceOnUse(document: Document, namespace: string, prefix: string): boolean {
        if (this.hasElementsOnNamespace(document, namespace, prefix)) {
            return true;
        }
        if (this.hasAttributesOnNamespace(document, namespace, prefix)) {
            return true;
        }

        return false;
    }

    protected hasElementsOnNamespace(document: Document, namespace: string, prefix: string): boolean {
        const elements = select(
            `//*[namespace-uri()="${namespace}" and name()=concat("${prefix}", local-name())]`,
            document
        );

        return elements.length > 0;
    }

    protected hasAttributesOnNamespace(document: Document, namespace: string, prefix: string): boolean {
        const attributes = select(
            `//@*[namespace-uri()="${namespace}" and name()=concat("${prefix}", local-name())]`,
            document
        );

        return attributes.length > 0;
    }
}

export { RemoveUnusedNamespaces };
