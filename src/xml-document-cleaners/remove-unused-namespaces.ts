import { Mixin } from 'ts-mixer';
import xpath from 'xpath';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { type XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';

class RemoveUnusedNamespaces extends Mixin(XmlNamespaceMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            this.checkNamespaceNode(document, namespaceNode);
        }
    }

    protected hasElementsOnNamespace(document: Document, namespace: string, prefix: string): boolean {
        // eslint-disable-next-line import/no-named-as-default-member
        const elements = xpath.select(
            `//*[namespace-uri()="${namespace}" and name()=concat("${prefix}", local-name())]`,
            document,
        ) as Node[] | null;

        return Boolean(elements && elements.length > 0);
    }

    protected hasAttributesOnNamespace(document: Document, namespace: string, prefix: string): boolean {
        // eslint-disable-next-line import/no-named-as-default-member
        const attributes = xpath.select(
            `//@*[namespace-uri()="${namespace}" and name()=concat("${prefix}", local-name())]`,
            document,
        ) as Node[] | null;

        return Boolean(attributes && attributes.length > 0);
    }

    private checkNamespaceNode(document: Document, namespaceNode: Attr): void {
        const namespace = namespaceNode.nodeValue;
        /* istanbul ignore if -- For usage always is not null but for default nodeValue is posible null @preserve */
        if (namespace === null) {
            return;
        }

        const localName = namespaceNode.localName === '' ? '' : namespaceNode.localName + ':';
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
}

export { RemoveUnusedNamespaces };
