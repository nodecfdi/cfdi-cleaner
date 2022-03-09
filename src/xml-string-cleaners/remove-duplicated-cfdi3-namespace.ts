import { XmlStringCleanerInterface } from '../xml-string-cleaner-interface';

/**
 * @deprecated Since version 1.2.0
 * Will be deleted in version 2.0.0
 * @see RenameElementAddPrefix
 */
export class RemoveDuplicatedCfdi3Namespace implements XmlStringCleanerInterface {
    public clean(xml: string): string {
        console.warn('Calling a deprecated class, use RenameElementAddPrefix');
        return xml;
    }
}
