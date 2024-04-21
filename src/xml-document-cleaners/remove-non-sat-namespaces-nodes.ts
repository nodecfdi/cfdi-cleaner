import { Mixin } from 'ts-mixer';
import xpath from 'xpath';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { type XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';

class RemoveNonSatNamespacesNodes
  extends Mixin(XmlAttributeMethodsTrait, XmlElementMethodsTrait, XmlNamespaceMethodsTrait)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const namespaces = this.obtainNamespacesFromDocument(document);
    for (const namespace of namespaces) {
      if (!this.isNamespaceRelatedToSat(namespace)) {
        this.removeElementsWithNamespace(document, namespace);
        this.removeAttributesWithNamespace(document, namespace);
      }
    }
  }

  private obtainNamespacesFromDocument(document: Document): string[] {
    const namespaces: string[] = [];
    for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
      namespaces.push(namespaceNode.nodeValue!);
    }

    return namespaces.filter((v, index, a) => a.indexOf(v) === index);
  }

  private removeElementsWithNamespace(document: Document, namespace: string): void {
    // eslint-disable-next-line import/no-named-as-default-member
    const elements = xpath.select(`//*[namespace-uri()="${namespace}"]`, document) as Element[];
    for (const element of elements) {
      this.elementRemove(element);
    }
  }

  private removeAttributesWithNamespace(document: Document, namespace: string): void {
    // eslint-disable-next-line import/no-named-as-default-member
    const attributes = xpath.select(`//@*[namespace-uri()="${namespace}"]`, document) as Attr[];
    for (const attribute of attributes) {
      this.attributeRemove(attribute);
    }
  }
}

export { RemoveNonSatNamespacesNodes };
