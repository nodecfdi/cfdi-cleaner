/**
 * This provides methods used for xml elements handling. It´s not meant to
 * be used directly.
 */
export class XmlElementMethods {
  protected elementRemove(element: Element): void {
    const parent = element.parentNode;
    /* istanbul ignore else -- For usage always is not null but for default parent is posible null @preserve */
    if (parent !== null) {
      parent.removeChild(element);
    }
  }

  protected elementMove(element: Element, parent: Element): void {
    this.elementRemove(element);
    parent.appendChild(element);
  }
}
