import { AppendXmlDeclaration } from '#src/xml_string_cleaners/append_xml_declaration';

describe('append xml declaration', () => {
  test.each([
    [
      'skip xml with header',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
    ],
    ['add to xml without header', '<?xml version="1.0"?>\n<root/>', '<root/>'],
    ['add to non xml', '<?xml version="1.0"?>\nfoo', 'foo'],
  ])('clean %s', (_message, expected, input) => {
    const cleaner = new AppendXmlDeclaration();
    const clean = cleaner.clean(input);

    expect(clean).toBe(expected);
  });
});
