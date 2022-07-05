import { Mixin } from 'ts-mixer';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { CfdiXPath } from '../internal/cfdi-x-path';
import { SchemaLocation } from '../internal/schema-location';

class RemoveIncompleteSchemaLocations extends Mixin(XmlAttributeMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        const xpath = CfdiXPath.createFromDocument(document);
        const schemaLocations = xpath.queryAttributes<Attr>('//@xsi:schemaLocation');
        schemaLocations.forEach((schemaLocation) => {
            const value = this.cleanSchemaLocationValue(schemaLocation.value);
            this.attributeSetValueOrRemoveIfEmpty(schemaLocation, value);
        }, this);
    }

    /**
     * @param schemaLocationValue - SchemaLocation
     * @internal
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
     * @internal
     */
    public schemaLocationValueNamespaceXsdPairToArray(schemaLocationValue: string): Record<string, string> {
        const components = SchemaLocation.valueToComponents(schemaLocationValue);
        const pairs: Record<string, string> = {};
        for (let c = 0; c < components.length; c = c + 1) {
            const namespace = components[c];
            if (this.uriEndsWithXsd(namespace)) {
                // namespace is a location
                continue;
            }

            const location = components[c + 1] ?? '';
            if (!this.uriEndsWithXsd(location)) {
                // location is a namespace
                continue;
            }

            // namespace match with location that ends with xsd
            pairs[namespace] = location;
            c = c + 1; // skip ns declaration
        }

        return pairs;
    }

    public uriEndsWithXsd(uri: string): boolean {
        return uri.toLowerCase().endsWith('.xsd');
    }
}

export { RemoveIncompleteSchemaLocations };
