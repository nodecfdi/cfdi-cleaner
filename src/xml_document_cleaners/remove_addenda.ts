import { Mixin } from 'ts-mixer';
import { XmlElementMethods } from '#src/mixins/xml_element_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export class RemoveAddenda extends Mixin(XmlElementMethods) implements XmlDocumentCleanerInterface {
  public clean(document: Document): void {
    this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/3');
    this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/4');
  }

  private removeAddendas(document: Document, namespace: string): void {
    const addendas = document.getElementsByTagNameNS(namespace, 'Addenda');
    // eslint-disable-next-line unicorn/prefer-spread
    for (const element of Array.from(addendas)) {
      this.elementRemove(element);
    }
  }
}
