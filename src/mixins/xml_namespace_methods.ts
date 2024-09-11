import xpath from 'xpath';
import { Namespaces } from '#src/constants/namespaces';

/**
 * This provides methods used for xml namespaces handling. It´s not meant to
 * be used directly.
 */
export class XmlNamespaceMethods {
  protected *iterateNonReservedNamespaces(document: Document): Generator<Attr> {
    const namespaceNodes = (xpath as unknown as XPathEvaluator).evaluate(
      "(//*|//@*)[local-name(.)='xmlns' or starts-with(name(), 'xmlns')]",
      document,
      null,
      0,
      null,
    );

    let namespaceNode = namespaceNodes.iterateNext();
    while (namespaceNode) {
      if (!this.isNamespaceReserved(namespaceNode.nodeValue!)) {
        yield namespaceNode as Attr;
      }

      namespaceNode = namespaceNodes.iterateNext();
    }
  }

  protected removeNamespaceNodeAttribute(namespaceNode: Attr): void {
    const { ownerElement, localName, nodeName } = namespaceNode;
    /* istanbul ignore else -- For usage always is has attribute ns but for default bool is posible false @preserve */
    if (ownerElement!.hasAttributeNS(Namespaces.NamespaceXmlns, localName)) {
      ownerElement!.removeAttribute(nodeName);
    }
  }

  protected isNamespaceReserved(namespace: string): boolean {
    const reservedNameSpaces: string[] = [
      Namespaces.NamespaceXml,
      Namespaces.NamespaceXmlns,
      Namespaces.NamespaceXsi,
    ];

    return reservedNameSpaces.includes(namespace);
  }

  protected isNamespaceRelatedToSat(namespace: string): boolean {
    return namespace.startsWith('http://www.sat.gob.mx/');
  }
}
