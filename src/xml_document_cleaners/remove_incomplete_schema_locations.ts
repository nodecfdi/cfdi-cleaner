import { type Document } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import CfdiXPath from '#src/internal/cfdi_x_path';
import SchemaLocation from '#src/internal/schema_location';
import XmlAttributeMethods from '#src/mixins/xml_attribute_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class RemoveIncompleteSchemaLocations
  extends Mixin(XmlAttributeMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const xpath = CfdiXPath.createFromDocument(document);
    const schemaLocations = xpath.querySchemaLocations();
    for (const schemaLocation of schemaLocations) {
      const value = this.cleanSchemaLocationValue(schemaLocation.value);
      this.attributeSetValueOrRemoveIfEmpty(schemaLocation, value);
    }
  }

  /**
   * @param schemaLocationValue - SchemaLocation
   */
  public cleanSchemaLocationValue(schemaLocationValue: string): string {
    const pairs = this.schemaLocationValueNamespaceXsdPairToArray(schemaLocationValue);
    const schemaLocation = new SchemaLocation(pairs);

    return schemaLocation.asValue();
  }

  /**
   * Parses schema location value skipping namespaces without xsd locations (identified by .xsd extension)
   *
   * @param schemaLocationValue - SchemaLocation
   */
  public schemaLocationValueNamespaceXsdPairToArray(
    schemaLocationValue: string,
  ): Record<string, string> {
    const components = SchemaLocation.valueToComponents(schemaLocationValue);
    const pairs: Record<string, string> = {};
    for (let c = 0; c < components.length; c += 1) {
      const namespace = components[c];
      if (this.uriEndsWithXsd(namespace)) {
        // Namespace is a location
        continue;
      }

      const location = components[c + 1] ?? '';
      if (!this.uriEndsWithXsd(location)) {
        // Location is a namespace
        continue;
      }

      // Namespace match with location that ends with xsd
      pairs[namespace] = location;
      c += 1; // Skip ns declaration
    }

    return pairs;
  }

  public uriEndsWithXsd(uri: string): boolean {
    return uri.toLowerCase().endsWith('.xsd');
  }
}
