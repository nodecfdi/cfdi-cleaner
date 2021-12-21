import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';

interface RemoveAddenda extends XmlElementMethodsTrait {}

class RemoveAddenda implements XmlDocumentCleanerInterface {
    @use(XmlElementMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const addendas = document.getElementsByTagNameNS('http://www.sat.gob.mx/cfd/3', 'Addenda');
        Array.from(addendas).forEach((addenda) => {
            this.elementRemove(addenda);
        });
    }
}

export { RemoveAddenda };
