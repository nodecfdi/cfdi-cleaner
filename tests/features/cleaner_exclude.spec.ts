import 'jest-xml-matcher';
import Cleaner from '#src/cleaner';
import ExcludeList from '#src/exclude_list';
import MoveNamespaceDeclarationToRoot from '#src/xml_document_cleaners/move_namespace_declaration_to_root';
import RemoveAddenda from '#src/xml_document_cleaners/remove_addenda';
import RemoveNonSatNamespacesNodes from '#src/xml_document_cleaners/remove_non_sat_namespaces_nodes';
import RemoveNonSatSchemaLocations from '#src/xml_document_cleaners/remove_non_sat_schema_locations';

describe('cleaners exclude', () => {
  test('cleaner exclude addenda', () => {
    const xml = [
      '<?xml version="1.0"?>',
      '<cfdi:Comprobante xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
      ' xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
      ' xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd"',
      ' Version="4.0">',
      '<cfdi:Addenda>',
      '    <foo:Main id="1" xmlns:foo="urn:foo"/>',
      '</cfdi:Addenda>',
      '</cfdi:Comprobante>',
    ].join('');

    const excludeList = new ExcludeList(
      RemoveAddenda,
      RemoveNonSatNamespacesNodes,
      RemoveNonSatSchemaLocations,
      MoveNamespaceDeclarationToRoot,
    );

    const cleaner = new Cleaner();
    cleaner.exclude(excludeList);

    const xmlClean = cleaner.cleanStringToString(xml);
    expect(xmlClean).toEqualXML(xml);
  });
});
