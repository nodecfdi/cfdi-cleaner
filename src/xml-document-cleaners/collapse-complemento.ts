import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { Cfdi3XPath } from '../internal/cfdi3-x-path';

interface CollapseComplemento extends XmlElementMethodsTrait {}

class CollapseComplemento implements XmlDocumentCleanerInterface {
    @use(XmlElementMethodsTrait)private this: unknown;

    public clean(document: Document): void {
        const xpath3 = Cfdi3XPath.createFromDocument(document);

        const complementos = xpath3.queryElements<Element>('/cfdi:Comprobante/cfdi:Complemento');
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
