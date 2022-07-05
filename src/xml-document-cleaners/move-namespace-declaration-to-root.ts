import { Mixin } from 'ts-mixer';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { XmlConstants } from '../internal/xml-constants';

class MoveNamespaceDeclarationToRoot extends Mixin(XmlNamespaceMethodsTrait) implements XmlDocumentCleanerInterface {
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
        if (rootElement === namespaceNode.ownerElement) {
            return;
        }

        //if overlapped case
        if (!rootElement.hasAttribute(namespaceNode.nodeName)) {
            rootElement.setAttributeNS(
                XmlConstants.NAMESPACE_XMLNS,
                namespaceNode.nodeName,
                namespaceNode.nodeValue || ''
            );
        }

        this.removeNamespaceNodeAttribute(namespaceNode);
    }
}

export { MoveNamespaceDeclarationToRoot };
