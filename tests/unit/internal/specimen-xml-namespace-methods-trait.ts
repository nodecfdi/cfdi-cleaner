import { Mixin } from 'ts-mixer';
import { XmlNamespaceMethodsTrait } from '~/internal/xml-namespace-methods-trait';

class SpecimenXmlNamespaceMethodsTrait extends Mixin(XmlNamespaceMethodsTrait) {
    public pIterateNonReservedNamespaces(document: Document): Generator<Attr> {
        return this.iterateNonReservedNamespaces(document);
    }

    public pRemoveNamespaceNodeAttribute(namespaceNode: Attr): void {
        this.removeNamespaceNodeAttribute(namespaceNode);
    }

    public obtainNamespaces(document: Document): Record<string, string> {
        const namespaces: Record<string, string> = {};
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            namespaces[namespaceNode.localName] = namespaceNode.nodeValue ?? '';
        }

        return namespaces;
    }

    public removeNamespaceNodesWithNamespace(document: Document, namespace: string): void {
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            if (namespaceNode.nodeValue === namespace) {
                this.removeNamespaceNodeAttribute(namespaceNode);
            }
        }
    }
}

export { SpecimenXmlNamespaceMethodsTrait };
