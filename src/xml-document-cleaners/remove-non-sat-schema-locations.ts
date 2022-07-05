import { Mixin } from 'ts-mixer';
import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';
import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { CfdiXPath } from '../internal/cfdi-x-path';
import { SchemaLocation } from '../internal/schema-location';

class RemoveNonSatSchemaLocations
    extends Mixin(XmlAttributeMethodsTrait, XmlNamespaceMethodsTrait)
    implements XmlDocumentCleanerInterface
{
    public clean(document: Document): void {
        const xpath = CfdiXPath.createFromDocument(document);
        const schemaLocations = xpath.queryAttributes<Attr>('//@xsi:schemaLocation');
        schemaLocations.forEach((schemaLocation) => {
            const value = this.cleanSchemaLocationsValue(schemaLocation.value);
            this.attributeSetValueOrRemoveIfEmpty(schemaLocation, value);
        });
    }

    public cleanSchemaLocationsValue(schemaLocationValue: string): string {
        const schemaLocation = SchemaLocation.createFromValue(schemaLocationValue);
        schemaLocation.filterUsingNamespace((namespace): boolean => {
            return this.isNamespaceRelatedToSat(namespace);
        });

        return schemaLocation.asValue();
    }
}

export { RemoveNonSatSchemaLocations };
