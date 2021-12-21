import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { XmlConstants } from '../internal/xml-constants';

interface MoveNamespaceDeclarationToRoot extends XmlNamespaceMethodsTrait {}

class MoveNamespaceDeclarationToRoot implements XmlDocumentCleanerInterface {
    @use(XmlNamespaceMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const rootElement = document.documentElement;
        if (!rootElement) {
            return;
        }

        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            this.cleanNameSpaceNode(rootElement, namespaceNode);
        }
    }

    private cleanNameSpaceNode(rootElement: Element, namespaceNode: Attr): void {
        if (rootElement === namespaceNode.ownerElement || rootElement.hasAttribute(namespaceNode.nodeName)) {
            return;
        }

        rootElement.setAttributeNS(XmlConstants.NAMESPACE_XMLNS, namespaceNode.nodeName, namespaceNode.nodeValue || '');

        this.removeNamespaceNodeAttribute(namespaceNode);
    }
}

export { MoveNamespaceDeclarationToRoot };
