import { Mixin } from 'ts-mixer';
import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';

class RemoveAddenda extends Mixin(XmlElementMethodsTrait) implements XmlDocumentCleanerInterface {
    public clean(document: Document): void {
        this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/3');
        this.removeAddendas(document, 'http://www.sat.gob.mx/cfd/4');
    }

    private removeAddendas(document: Document, namespace: string): void {
        const addendas = document.getElementsByTagNameNS(namespace, 'Addenda');
        for (const element of Array.from(addendas)) {
            this.elementRemove(element);
        }
    }
}

export { RemoveAddenda };
