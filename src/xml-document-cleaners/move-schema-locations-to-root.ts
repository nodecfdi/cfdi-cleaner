import { Mixin } from 'ts-mixer';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { XmlConstants } from '../internal/xml-constants';
import { SchemaLocation } from '../internal/schema-location';
import { CfdiXPath } from '../internal/cfdi-x-path';

class MoveSchemaLocationsToRoot
    extends Mixin(XmlNamespaceMethodsTrait, XmlAttributeMethodsTrait)
    implements XmlDocumentCleanerInterface
{
    public clean(document: Document): void {
        const root = document.documentElement;

        if (!root.hasAttributeNS(XmlConstants.NAMESPACE_XSI, 'schemaLocation')) {
            root.setAttributeNS(XmlConstants.NAMESPACE_XSI, 'xsi:schemaLocation', '');
        }
        const rootAttribute = root.getAttributeNodeNS(XmlConstants.NAMESPACE_XSI, 'schemaLocation') as Attr;
        const schemaLocation = SchemaLocation.createFromValue(rootAttribute.nodeValue as string);

        const xpath = CfdiXPath.createFromDocument(document);
        const schemaLocationAttributes = xpath.queryAttributes<Attr>(
            '//@*[local-name()="schemaLocation" or local-name()="xsi"]'
        );
        for (const schemaLocationAttribute of schemaLocationAttributes) {
            if (rootAttribute === schemaLocationAttribute) {
                continue;
            }

            if (schemaLocationAttribute.localName !== 'xsi') {
                const currenSchemaLocation = SchemaLocation.createFromValue(schemaLocationAttribute.nodeValue || '');
                schemaLocation.import(currenSchemaLocation);
            }

            this.attributeRemove(schemaLocationAttribute);
        }

        rootAttribute.nodeValue = schemaLocation.asValue();
        rootAttribute.value = schemaLocation.asValue();
    }
}

export { MoveSchemaLocationsToRoot };
