import { type Document } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import CfdiXPath from '#src/internal/cfdi_x_path';
import SchemaLocation from '#src/internal/schema_location';
import XmlAttributeMethods from '#src/mixins/xml_attribute_methods';
import XmlNamespaceMethods from '#src/mixins/xml_namespace_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class RemoveNonSatSchemaLocations
  extends Mixin(XmlAttributeMethods, XmlNamespaceMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const xpath = CfdiXPath.createFromDocument(document);
    const schemaLocations = xpath.querySchemaLocations();
    for (const schemaLocation of schemaLocations) {
      const value = this.cleanSchemaLocationsValue(schemaLocation.value);
      this.attributeSetValueOrRemoveIfEmpty(schemaLocation, value);
    }
  }

  public cleanSchemaLocationsValue(schemaLocationValue: string): string {
    const schemaLocation = SchemaLocation.createFromValue(schemaLocationValue);
    schemaLocation.filterUsingNamespace((namespace): boolean =>
      this.isNamespaceRelatedToSat(namespace),
    );

    return schemaLocation.asValue();
  }
}
