import { type Document } from '@nodecfdi/cfdi-core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = any> = new (...args: T[]) => T;

export interface XmlDocumentCleanerInterface {
  clean(document: Document): void;
}

export interface XmlStringCleanerInterface {
  clean(xml: string): string;
}
