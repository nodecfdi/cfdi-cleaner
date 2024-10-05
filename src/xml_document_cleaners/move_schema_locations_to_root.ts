import { type Attr, type Document, NAMESPACE } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import CfdiXPath from '#src/internal/cfdi_x_path';
import SchemaLocation from '#src/internal/schema_location';
import XmlAttributeMethods from '#src/mixins/xml_attribute_methods';
import XmlNamespaceMethods from '#src/mixins/xml_namespace_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';
import { namespaceXsi } from '#src/utils/constants';

export default class MoveSchemaLocationsToRoot
  extends Mixin(XmlNamespaceMethods, XmlAttributeMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const root = document.documentElement!;
    const xpath = CfdiXPath.createFromDocument(document);

    if (!root.hasAttributeNS(namespaceXsi, 'schemaLocation')) {
      const namespacesXsi = xpath.queryAttributes<Attr>('//@*[name()="xmlns:xsi"]');
      for (const namespaceXsiAttribute of namespacesXsi) {
        /* istanbul ignore else -- For @xmldom/xmldom is always xmlns:xsi but posibly in others not same @preserve */
        if (namespaceXsiAttribute.nodeValue === namespaceXsi) {
          this.attributeRemove(namespaceXsiAttribute);
        }
      }

      root.setAttributeNS(NAMESPACE.XMLNS, 'xmlns:xsi', namespaceXsi);
      root.setAttributeNS(namespaceXsi, 'xsi:schemaLocation', '');
    }

    const rootAttribute = root.getAttributeNodeNS(namespaceXsi, 'schemaLocation')!;
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
