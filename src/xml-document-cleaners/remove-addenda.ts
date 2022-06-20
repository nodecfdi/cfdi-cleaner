import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { CfdiXPath } from '../internal/cfdi-x-path';

interface RemoveAddenda extends XmlElementMethodsTrait {}

class RemoveAddenda implements XmlDocumentCleanerInterface {
    @use(XmlElementMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const xpath = CfdiXPath.createFromDocument(document);
        const addendas = xpath.queryElements<Element>('/cfdi:Comprobante/cfdi:Addenda');

        Array.from(addendas).forEach((addenda) => {
            this.elementRemove(addenda);
        });
    }
}

export { RemoveAddenda };
