import { type Attr, type Document, type Element } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import xpath from 'xpath';
import XmlAttributeMethods from '#src/mixins/xml_attribute_methods';
import XmlElementMethods from '#src/mixins/xml_element_methods';
import XmlNamespaceMethods from '#src/mixins/xml_namespace_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class RemoveNonSatNamespacesNodes
  extends Mixin(XmlAttributeMethods, XmlElementMethods, XmlNamespaceMethods)
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
    // @ts-expect-error misssing Node properties are not needed
    const elements = xpath.select(`//*[namespace-uri()="${namespace}"]`, document) as Element[];
    for (const element of elements) {
      this.elementRemove(element);
    }
  }

  private removeAttributesWithNamespace(document: Document, namespace: string): void {
    // @ts-expect-error misssing Node properties are not needed
    const attributes = xpath.select(`//@*[namespace-uri()="${namespace}"]`, document) as Attr[];
    for (const attribute of attributes) {
      this.attributeRemove(attribute);
    }
  }
}
