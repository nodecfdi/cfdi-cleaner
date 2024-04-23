import { Mixin } from 'ts-mixer';
import { Namespaces } from '../constants/namespaces.js';
import { XmlNamespaceMethods } from '../mixins/xml_namespace_methods.js';
import { type XmlDocumentCleanerInterface } from '../types.js';

export class MoveNamespaceDeclarationToRoot
  extends Mixin(XmlNamespaceMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const rootElement = document.documentElement;

    for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
      this.cleanNameSpaceNode(rootElement, namespaceNode);
    }
  }

  private cleanNameSpaceNode(rootElement: Element, namespaceNode: Attr): void {
    if (rootElement === namespaceNode.ownerElement) {
      return;
    }

    // If overlapped case
    if (!rootElement.hasAttribute(namespaceNode.nodeName) && namespaceNode.nodeValue) {
      rootElement.setAttributeNS(
        Namespaces.NamespaceXmlns,
        namespaceNode.nodeName,
        namespaceNode.nodeValue,
      );
    }

    this.removeNamespaceNodeAttribute(namespaceNode);
  }
}
