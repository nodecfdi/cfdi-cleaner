import { Mixin } from 'ts-mixer';
import { Namespaces } from '../constants/namespaces.js';
import { CfdiXPath } from '../internal/cfdi_x_path.js';
import { SchemaLocation } from '../internal/schema_location.js';
import { XmlAttributeMethods } from '../mixins/xml_attribute_methods.js';
import { XmlNamespaceMethods } from '../mixins/xml_namespace_methods.js';
import { type XmlDocumentCleanerInterface } from '../types.js';

export class MoveSchemaLocationsToRoot
  extends Mixin(XmlNamespaceMethods, XmlAttributeMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const root = document.documentElement;
    const xpath = CfdiXPath.createFromDocument(document);

    if (!root.hasAttributeNS(Namespaces.NamespaceXsi, 'schemaLocation')) {
      const namespacesXsi = xpath.queryAttributes<Attr>('//@*[name()="xmlns:xsi"]');
      for (const namespaceXsiAttribute of namespacesXsi) {
        /* istanbul ignore else -- For @xmldom/xmldom is always xmlns:xsi but posibly in others not same @preserve */
        if (namespaceXsiAttribute.nodeValue === Namespaces.NamespaceXsi) {
          this.attributeRemove(namespaceXsiAttribute);
        }
      }

      root.setAttributeNS(Namespaces.NamespaceXmlns, 'xmlns:xsi', Namespaces.NamespaceXsi);
      root.setAttributeNS(Namespaces.NamespaceXsi, 'xsi:schemaLocation', '');
    }

    const rootAttribute = root.getAttributeNodeNS(Namespaces.NamespaceXsi, 'schemaLocation')!;
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
