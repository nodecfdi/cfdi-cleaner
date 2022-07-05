import { Mixin } from 'ts-mixer';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { select } from 'xpath';

class RemoveNonSatNamespacesNodes
    extends Mixin(XmlAttributeMethodsTrait, XmlElementMethodsTrait, XmlNamespaceMethodsTrait)
    implements XmlDocumentCleanerInterface
{
    public clean(document: Document): void {
        const namespaces = this.obtainNamespacesFromDocument(document);
        namespaces.forEach((namespace) => {
            if (!this.isNamespaceRelatedToSat(namespace)) {
                this.removeElementsWithNamespace(document, namespace);
                this.removeAttributesWithNamespace(document, namespace);
            }
        });
    }

    private obtainNamespacesFromDocument(document: Document): string[] {
        const namespaces: string[] = [];
        for (const namespaceNode of this.iterateNonReservedNamespaces(document)) {
            if (namespaceNode.nodeValue) namespaces.push(namespaceNode.nodeValue);
        }

        return namespaces.filter((v, i, a) => a.indexOf(v) === i);
    }

    private removeElementsWithNamespace(document: Document, namespace: string): void {
        const elements = select(`//*[namespace-uri()="${namespace}"]`, document) as Element[];
        elements.forEach((element) => {
            this.elementRemove(element);
        });
    }

    private removeAttributesWithNamespace(document: Document, namespace: string): void {
        const attributes = select(`//@*[namespace-uri()="${namespace}"]`, document) as Attr[];
        attributes.forEach((attribute) => {
            this.attributeRemove(attribute);
        });
    }
}

export { RemoveNonSatNamespacesNodes };
