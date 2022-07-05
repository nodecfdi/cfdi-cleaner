import { Mixin } from 'ts-mixer';
import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { CfdiXPath } from '../internal/cfdi-x-path';

class RemoveAddenda extends Mixin(XmlElementMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        const xpath = CfdiXPath.createFromDocument(document);
        const addendas = xpath.queryElements<Element>('/cfdi:Comprobante/cfdi:Addenda');

        Array.from(addendas).forEach((addenda) => {
            this.elementRemove(addenda);
        });
    }
}

export { RemoveAddenda };
