import { evaluate } from 'xpath';
import { XmlConstants } from './xml-constants';

/**
 * This provides methods used for xml namespaces handling. It´s not meant to
 * be used directly.
 */
export class XmlNamespaceMethodsTrait {
    protected *iterateNonReservedNamespaces(document: Document): Generator<Attr> {
        const namespaceNodes = evaluate(
            "(//*|//@*)[local-name(.)='xmlns' or starts-with(name(), 'xmlns')]",
            document,
            null,
            0,
            null
        );
        let namespaceNode = namespaceNodes.iterateNext();
        while (namespaceNode) {
            if (!this.isNamespaceReserved(namespaceNode.nodeValue || '')) {
                yield namespaceNode as Attr;
            }

            namespaceNode = namespaceNodes.iterateNext();
        }
    }

    protected removeNamespaceNodeAttribute(namespaceNode: Attr): void {
        const ownerElement = namespaceNode.ownerElement;
        if (ownerElement !== null) {
            if (ownerElement.hasAttributeNS(XmlConstants.NAMESPACE_XMLNS, namespaceNode.localName)) {
                ownerElement.removeAttribute(namespaceNode.nodeName);
            }
        }
    }

    protected isNamespaceReserved(namespace: string): boolean {
        const reservedNameSpaces: string[] = [
            XmlConstants.NAMESPACE_XML,
            XmlConstants.NAMESPACE_XMLNS,
            XmlConstants.NAMESPACE_XSI
        ];

        return reservedNameSpaces.includes(namespace);
    }

    protected isNamespaceRelatedToSat(namespace: string): boolean {
        return namespace.startsWith('http://www.sat.gob.mx/');
    }
}
