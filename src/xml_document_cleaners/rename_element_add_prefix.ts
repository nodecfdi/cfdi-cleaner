import { Mixin } from 'ts-mixer';
import { XmlNamespaceMethods } from '#src/mixins/xml_namespace_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export class RenameElementAddPrefix
  extends Mixin(XmlNamespaceMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const rootElement = document.documentElement;

    // Remove unused xmlns declarations
    for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
      // Remove xmlns only
      if (namespaceNode.nodeName === 'xmlns') {
        this.removeNamespaceNodeAttribute(namespaceNode);
      }

      // Remove namespace prefix
      if (
        namespaceNode.ownerElement &&
        namespaceNode.ownerElement !== rootElement &&
        this.queryPrefix(namespaceNode.ownerElement) !== ''
      ) {
        this.removeNamespaceNodeAttribute(namespaceNode);
      }
    }
  }

  private queryPrefix(element: Element): string {
    const namespace = element.namespaceURI;

    /* istanbul ignore if -- For usage always is not null but for default ownerElement is posible null @preserve */
    if (namespace === null) {
      return '';
    }

    const document = element.ownerDocument;
    for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
      if (element !== namespaceNode.ownerElement) {
        continue;
      }

      const prefix = namespaceNode.localName;
      if (prefix !== '' && namespaceNode.nodeValue === namespace) {
        return prefix;
      }
    }

    /* istanbul ignore next -- Very difficult of test @preserve */
    return '';
  }
}
