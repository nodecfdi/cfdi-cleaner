import { type Attr, type Document, isAttribute, NAMESPACE } from '@nodecfdi/cfdi-core';
import xpath from 'xpath';
import { namespaceXsi } from '#src/utils/constants';

/**
 * This provides methods used for xml namespaces handling. It´s not meant to
 * be used directly.
 */
export default class XmlNamespaceMethods {
  protected *iterateNonReservedNamespaces(document: Document): Generator<Attr> {
    const namespaceNodes = (xpath as unknown as XPathEvaluator).evaluate(
      "(//*|//@*)[local-name(.)='xmlns' or starts-with(name(), 'xmlns')]",
      // @ts-expect-error misssing Node properties are not needed
      document,
      null,
      0,
      null,
    );

    let namespaceNode = namespaceNodes.iterateNext();
    while (namespaceNode) {
      if (!this.isNamespaceReserved(`${namespaceNode.nodeValue}`) && isAttribute(namespaceNode)) {
        yield namespaceNode;
      }

      namespaceNode = namespaceNodes.iterateNext();
    }
  }

  protected removeNamespaceNodeAttribute(namespaceNode: Attr): void {
    const { ownerElement, localName, nodeName } = namespaceNode;
    /* istanbul ignore else -- For usage always is has attribute ns but for default bool is posible false @preserve */
    if (ownerElement!.hasAttributeNS(NAMESPACE.XMLNS, `${localName}`)) {
      ownerElement!.removeAttribute(nodeName);
    }
  }

  protected isNamespaceReserved(namespace: string): boolean {
    const reservedNameSpaces: string[] = [NAMESPACE.XML, NAMESPACE.XMLNS, namespaceXsi];

    return reservedNameSpaces.includes(namespace);
  }

  protected isNamespaceRelatedToSat(namespace: string): boolean {
    return namespace.startsWith('http://www.sat.gob.mx/');
  }
}
