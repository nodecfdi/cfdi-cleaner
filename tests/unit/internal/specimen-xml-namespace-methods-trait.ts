import { use } from 'typescript-mix';
import { XmlNamespaceMethodsTrait } from '../../../src/internal/xml-namespace-methods-trait';

interface SpecimenXmlNamespaceMethodsTrait extends XmlNamespaceMethodsTrait {}

/**
 * @mixes XmlNamespaceMethodsTrait
 */
class SpecimenXmlNamespaceMethodsTrait {
    @use(XmlNamespaceMethodsTrait) private this: unknown;

    public obtainNamespaces(document: Document): Record<string, string> {
        const namespaces: Record<string, string> = {};
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            namespaces[namespaceNode.localName] = namespaceNode.nodeValue || '';
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
