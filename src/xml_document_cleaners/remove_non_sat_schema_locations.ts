import { Mixin } from 'ts-mixer';
import { CfdiXPath } from '../internal/cfdi_x_path.js';
import { SchemaLocation } from '../internal/schema_location.js';
import { XmlAttributeMethods } from '../mixins/xml_attribute_methods.js';
import { XmlNamespaceMethods } from '../mixins/xml_namespace_methods.js';
import { type XmlDocumentCleanerInterface } from '../types.js';

export class RemoveNonSatSchemaLocations
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
