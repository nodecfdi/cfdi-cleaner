/**
 * This provides methods used for xml attributes handling. It´s not meant to
 * be used directly.
 */
export class XmlAttributeMethodsTrait {
    protected attributeRemove(attribute: Attr): void {
        const { ownerElement, nodeName } = attribute;
        if (ownerElement !== null) ownerElement.removeAttribute(nodeName);
    }

    protected attributeSetValueOrRemoveIfEmpty(attribute: Attr, value: string): void {
        if (value === '') {
            this.attributeRemove(attribute);

            return;
        }

        attribute.value = value;
        attribute.nodeValue = value;
    }
}
