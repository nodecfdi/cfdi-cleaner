/**
 * This provides methods used for xml elements handling. It´s not meant to
 * be used directly.
 */
export class XmlElementMethodsTrait {
    protected elementRemove(element: Element): void {
        const parent = element.parentNode;
        if (parent !== null) {
            parent.removeChild(element);
        }
    }

    protected elementMove(element: Element, parent: Element): void {
        this.elementRemove(element);
        parent.appendChild(element);
    }
}
