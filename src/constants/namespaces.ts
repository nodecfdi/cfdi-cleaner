export const Namespaces = {
  NamespaceXml: 'http://www.w3.org/XML/1998/namespace',
  NamespaceXmlns: 'http://www.w3.org/2000/xmlns/',
  NamespaceXsi: 'http://www.w3.org/2001/XMLSchema-instance',
} as const;

export type NamespacesType = (typeof Namespaces)[keyof typeof Namespaces];
