import { Mixin } from 'ts-mixer';
import CfdiXPath from '#src/internal/cfdi_x_path';
import XmlElementMethods from '#src/mixins/xml_element_methods';
import { type XmlDocumentCleanerInterface } from '#src/types';

export default class CollapseComplemento
  extends Mixin(XmlElementMethods)
  implements XmlDocumentCleanerInterface
{
  public clean(document: Document): void {
    const xpath = CfdiXPath.createFromDocument(document);

    const complementos = xpath.queryElements('/cfdi:Comprobante/cfdi:Complemento');
    if (complementos.length < 2) {
      return;
    }

    let receiver: Element | null = null;
    for (const complemento of complementos) {
      // First complemento
      if (!receiver) {
        receiver = complemento;
        continue;
      }

      // Non-first complemento
      while (complemento.childNodes.length > 0) {
        const child = complemento.childNodes.item(0);
        this.elementMove(child as Element, receiver);
      }

      this.elementRemove(complemento);
    }
  }
}
