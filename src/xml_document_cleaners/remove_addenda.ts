import { type Document } from '@nodecfdi/cfdi-core';
import { Mixin } from 'ts-mixer';
import XmlElementMethods from '#src/mixins/xml_element_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class RemoveAddenda
  extends Mixin(XmlElementMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/3');
    this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/4');
    this.removeAddendas(document, 'http://www.sat.gob.mx/esquemas/retencionpago/2');
    this.removeAddendas(document, 'http://www.sat.gob.mx/esquemas/retencionpago/1');
  }

  private removeAddendas(document: Document, namespace: string): void {
    const addendas = document.getElementsByTagNameNS(namespace, 'Addenda');
    for (const element of addendas) {
      this.elementRemove(element);
    }
  }
}
