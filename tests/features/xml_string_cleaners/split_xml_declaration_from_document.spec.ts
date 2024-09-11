import SplitXmlDeclarationFromDocument from '#src/xml_string_cleaners/split_xml_declaration_from_document';

describe('split xml declaration from document', () => {
  test.each([
    [
      'doc on line 1 no white space',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
      '<?xml version="1.0" encoding="UTF-8"?><root/>',
    ],
    [
      'doc on line 1',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
      '<?xml version="1.0" encoding="UTF-8"?> <root/>',
    ],
    [
      'doc on line 2',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
      '<?xml version="1.0" encoding="UTF-8"?> \n <root/>',
    ],
    [
      'doc on line 3',
      '<?xml version="1.0" encoding="UTF-8"?>\n<root/>',
      '<?xml version="1.0" encoding="UTF-8"?> \n \n <root/>',
    ],
    ['no declaration', '<root/>', '<root/>'],
    [
      'no encoding declaration + doc on line 2',
      '<?xml version="1.0"?>\n<root/>',
      '<?xml version="1.0"?> \n <root/>',
    ],
  ])('clean %s', (_name, expected, input) => {
    const cleaner = new SplitXmlDeclarationFromDocument();
    const clean = cleaner.clean(input);

    expect(clean).toBe(expected);
  });
});
