import { XmlElementMethodsTrait } from '../internal/xml-element-methods-trait';
import { XmlDocumentCleanerInterface } from '../xml-document-cleaner-interface';
import { use } from 'typescript-mix';
import { XmlConstants } from '../internal/xml-constants';

interface RemoveAddenda extends XmlElementMethodsTrait {}

class RemoveAddenda implements XmlDocumentCleanerInterface {
    @use(XmlElementMethodsTrait) private this: unknown;

    public clean(document: Document): void {
        const root = document.documentElement;
        const rootAttribute = root.getAttributeNodeNS(XmlConstants.NAMESPACE_XMLNS, 'cfdi');
        const namespaceCfdi =
            rootAttribute?.nodeValue === 'http://www.sat.gob.mx/cfd/3'
                ? 'http://www.sat.gob.mx/cfd/3'
                : 'http://www.sat.gob.mx/cfd/4';

        const addendas = document.getElementsByTagNameNS(namespaceCfdi, 'Addenda');
        Array.from(addendas).forEach((addenda) => {
            this.elementRemove(addenda);
        });
    }
}

export { RemoveAddenda };
