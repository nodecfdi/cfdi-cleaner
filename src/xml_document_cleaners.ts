import type ExcludeList from '#src/exclude_list';
import { type XmlDocumentCleanerInterface } from '#src/types';
import CollapseComplemento from '#src/xml_document_cleaners/collapse_complemento';
import MoveNamespaceDeclarationToRoot from '#src/xml_document_cleaners/move_namespace_declaration_to_root';
import MoveSchemaLocationsToRoot from '#src/xml_document_cleaners/move_schema_locations_to_root';
import RemoveAddenda from '#src/xml_document_cleaners/remove_addenda';
import RemoveIncompleteSchemaLocations from '#src/xml_document_cleaners/remove_incomplete_schema_locations';
import RemoveNonSatNamespacesNodes from '#src/xml_document_cleaners/remove_non_sat_namespaces_nodes';
import RemoveNonSatSchemaLocations from '#src/xml_document_cleaners/remove_non_sat_schema_locations';
import RemoveUnusedNamespaces from '#src/xml_document_cleaners/remove_unused_namespaces';
import RenameElementAddPrefix from '#src/xml_document_cleaners/rename_element_add_prefix';
import SetKnownSchemaLocations from '#src/xml_document_cleaners/set_known_schema_locations';

export default class XmlDocumentCleaners implements XmlDocumentCleanerInterface {
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
