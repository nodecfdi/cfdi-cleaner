import { XmlNamespaceMethodsTrait } from '../internal/xml-namespace-methods-trait';

import { XmlAttributeMethodsTrait } from '../internal/xml-attribute-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { Cfdi3XPath } from '../internal/cfdi3-x-path';
import { SchemaLocation } from '../internal/schema-location';

interface RemoveNonSatSchemaLocations extends XmlAttributeMethodsTrait, XmlNamespaceMethodsTrait {}

class RemoveNonSatSchemaLocations implements XmlDocumentCleanerInterface {
    @use(XmlAttributeMethodsTrait, XmlNamespaceMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const xpath = Cfdi3XPath.createFromDocument(document);
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
