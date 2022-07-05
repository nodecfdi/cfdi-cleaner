import { Mixin } from 'ts-mixer';
import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { CfdiXPath } from '../internal/cfdi-x-path';

class CollapseComplemento extends Mixin(XmlElementMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        const xpath = CfdiXPath.createFromDocument(document);

        const complementos = xpath.queryElements<Element>('/cfdi:Comprobante/cfdi:Complemento');
        if (complementos.length < 2) {
            return;
        }

        let receiver: Element | null = null;
        for (const complemento of complementos) {
            // first complemento
            if (!receiver) {
                receiver = complemento;
                continue;
            }

            // non-first complemento
            while (complemento.childNodes.length > 0) {
                const child = complemento.childNodes.item(0);
                this.elementMove(child as Element, receiver);
            }
            this.elementRemove(complemento);
        }
    }
}

export { CollapseComplemento };
