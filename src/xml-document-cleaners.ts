import { type XmlDocumentCleanerInterface } from './xml-document-cleaner-interface';
import { RemoveAddenda } from './xml-document-cleaners/remove-addenda';
import { RemoveIncompleteSchemaLocations } from './xml-document-cleaners/remove-incomplete-schema-locations';
import { RemoveNonSatNamespacesNodes } from './xml-document-cleaners/remove-non-sat-namespaces-nodes';
import { RemoveNonSatSchemaLocations } from './xml-document-cleaners/remove-non-sat-schema-locations';
import { RemoveUnusedNamespaces } from './xml-document-cleaners/remove-unused-namespaces';
import { MoveNamespaceDeclarationToRoot } from './xml-document-cleaners/move-namespace-declaration-to-root';
import { MoveSchemaLocationsToRoot } from './xml-document-cleaners/move-schema-locations-to-root';
import { SetKnownSchemaLocations } from './xml-document-cleaners/set-known-schema-locations';
import { CollapseComplemento } from './xml-document-cleaners/collapse-complemento';
import { RenameElementAddPrefix } from './xml-document-cleaners/rename-element-add-prefix';

export class XmlDocumentCleaners implements XmlDocumentCleanerInterface {
    public static createDefault(): XmlDocumentCleaners {
        return new XmlDocumentCleaners(
            new RemoveAddenda(),
            new RemoveIncompleteSchemaLocations(),
            new RemoveNonSatNamespacesNodes(),
            new RemoveNonSatSchemaLocations(),
            new RemoveUnusedNamespaces(),
            new RenameElementAddPrefix(),
            new MoveNamespaceDeclarationToRoot(),
            new MoveSchemaLocationsToRoot(),
            new SetKnownSchemaLocations(),
            new CollapseComplemento()
        );
    }

    private readonly cleaners: XmlDocumentCleanerInterface[];

    constructor(...cleaners: XmlDocumentCleanerInterface[]) {
        this.cleaners = cleaners;
    }

    public clean(document: Document): void {
        for (const cleaner of this.cleaners) {
            cleaner.clean(document);
        }
    }
}
