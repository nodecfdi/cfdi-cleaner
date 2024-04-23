import { RemoveNonXmlStrings } from '#src/xml_string_cleaners/remove_non_xml_strings';

describe('remove non xml strings', () => {
  test.each([
    ['nothing', '<a></a>', '<a></a>'],
    // eslint-disable-next-line unicorn/no-hex-escape
    ['utf-8 bom', '<a></a>', '\xEF\xBB\xBF<a></a>'],
    ['content at begin', '<a></a>', 'begin<a></a>'],
    ['content at end', '<a></a>', '<a></a>end'],
    ['whitespaces and text', '<a></a>', '--foo\n \n\t<a></a>\n--bar\n'],
    ['ltgt empty', '<>', '<>'],
    ['ltgt lead and trail', '<>', '_<>_'],
    ['out of order string', '', '_>_<_'],
    ['no xml', '< b && b >', 'a < b && b > c'],
    ['without lt or gt', '', 'a b c'],
    ['without gt ', '', 'a < b c'],
    ['without lt ', '', 'a b > c'],
  ])('clean %s', (_name, expected, input) => {
    const cleaner = new RemoveNonXmlStrings();
    const clean = cleaner.clean(input);

    expect(clean).toBe(expected);
  });
});
