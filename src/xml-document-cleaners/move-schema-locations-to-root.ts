import { Mixin } from 'ts-mixer';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { type XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { XmlConstants } from '../internal/xml-constants';
import { SchemaLocation } from '../internal/schema-location';
import { CfdiXPath } from '../internal/cfdi-x-path';

class MoveSchemaLocationsToRoot
  extends Mixin(XmlNamespaceMethodsTrait, XmlAttributeMethodsTrait)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const root = document.documentElement;
    const xpath = CfdiXPath.createFromDocument(document);

    if (!root.hasAttributeNS(XmlConstants.NAMESPACE_XSI, 'schemaLocation')) {
      // For @xmldom/xmldom require check xmlns:xsi for deep declarations with same space
      const namespacesXsi = xpath.queryAttributes<Attr>('//@*[name()="xmlns:xsi"]');
      for (const namespaceXsiAttribute of namespacesXsi) {
        /* istanbul ignore else -- For @xmldom/xmldom is always xmlns:xsi but posibly in others not same @preserve */
        if (namespaceXsiAttribute.nodeValue === XmlConstants.NAMESPACE_XSI) {
          this.attributeRemove(namespaceXsiAttribute);
        }
      }

      root.setAttributeNS(XmlConstants.NAMESPACE_XMLNS, 'xmlns:xsi', XmlConstants.NAMESPACE_XSI);
      root.setAttributeNS(XmlConstants.NAMESPACE_XSI, 'xsi:schemaLocation', '');
    }

    const rootAttribute = root.getAttributeNodeNS(XmlConstants.NAMESPACE_XSI, 'schemaLocation')!;
    const schemaLocation = SchemaLocation.createFromValue(rootAttribute.nodeValue!);

    const schemaLocationAttributes = xpath.querySchemaLocations();
    for (const schemaLocationAttribute of schemaLocationAttributes) {
      if (rootAttribute === schemaLocationAttribute) {
        continue;
      }

      const currenSchemaLocation = SchemaLocation.createFromValue(
        schemaLocationAttribute.nodeValue!,
      );
      schemaLocation.import(currenSchemaLocation);
      this.attributeRemove(schemaLocationAttribute);
    }

    rootAttribute.nodeValue = schemaLocation.asValue();
    rootAttribute.value = schemaLocation.asValue();
  }
}

export { MoveSchemaLocationsToRoot };
