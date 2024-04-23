import { type ExcludeList } from './exclude_list.js';
import { type XmlDocumentCleanerInterface } from './types.js';
import { CollapseComplemento } from './xml_document_cleaners/collapse_complemento.js';
import { MoveNamespaceDeclarationToRoot } from './xml_document_cleaners/move_namespace_declaration_to_root.js';
import { MoveSchemaLocationsToRoot } from './xml_document_cleaners/move_schema_locations_to_root.js';
import { RemoveAddenda } from './xml_document_cleaners/remove_addenda.js';
import { RemoveIncompleteSchemaLocations } from './xml_document_cleaners/remove_incomplete_schema_locations.js';
import { RemoveNonSatNamespacesNodes } from './xml_document_cleaners/remove_non_sat_namespaces_nodes.js';
import { RemoveNonSatSchemaLocations } from './xml_document_cleaners/remove_non_sat_schema_locations.js';
import { RemoveUnusedNamespaces } from './xml_document_cleaners/remove_unused_namespaces.js';
import { RenameElementAddPrefix } from './xml_document_cleaners/rename_element_add_prefix.js';
import { SetKnownSchemaLocations } from './xml_document_cleaners/set_known_schema_locations.js';

export class XmlDocumentCleaners implements XmlDocumentCleanerInterface {
  private readonly cleaners: XmlDocumentCleanerInterface[];

  public constructor(...cleaners: XmlDocumentCleanerInterface[]) {
    this.cleaners = cleaners;
  }

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
      new CollapseComplemento(),
    );
  }

  public clean(document: Document): void {
    for (const cleaner of this.cleaners) {
      cleaner.clean(document);
    }
  }

  public withOutCleaners(excludeList: ExcludeList): XmlDocumentCleaners {
    const cleaners = excludeList.filterObjects(...this.cleaners);

    return new XmlDocumentCleaners(...cleaners);
  }
}
