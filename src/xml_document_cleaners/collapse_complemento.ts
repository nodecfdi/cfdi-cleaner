import { Mixin } from 'ts-mixer';
import { CfdiXPath } from '../internal/cfdi_x_path.js';
import { XmlElementMethods } from '../mixins/xml_element_methods.js';
import { type XmlDocumentCleanerInterface } from '../types.js';

export class CollapseComplemento
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
