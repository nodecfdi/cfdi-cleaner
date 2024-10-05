import { type Attr, type Document, type Element, NAMESPACE } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import XmlNamespaceMethods from '#src/mixins/xml_namespace_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class MoveNamespaceDeclarationToRoot
  extends Mixin(XmlNamespaceMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const rootElement = document.documentElement!;

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
      rootElement.setAttributeNS(NAMESPACE.XMLNS, namespaceNode.nodeName, namespaceNode.nodeValue);
    }

    this.removeNamespaceNodeAttribute(namespaceNode);
  }
}
