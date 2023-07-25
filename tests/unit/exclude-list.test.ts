import { ExcludeList } from 'src/exclude-list';

describe('exclude_list', () => {
    test('constructor_with_empty_list', () => {
        const excludeList = new ExcludeList();

        expect(excludeList.isEmpty()).toBeTruthy();
        expect([...excludeList]).toStrictEqual([]);
    });

    test('constructor_with_values', () => {
        const classes = [Date, Error];

        const excludeList = new ExcludeList(...classes);

        expect(excludeList.isEmpty()).toBeFalsy();
        expect([...excludeList]).toStrictEqual(classes);
    });

    test('match', () => {
        const excludeList = new ExcludeList(Date);

        expect(excludeList.match(new Date())).toBeTruthy();
        expect(excludeList.match(new Date(Date.now()))).toBeTruthy();
        expect(excludeList.match({})).toBeFalsy();
        expect(excludeList.match(new Error('n'))).toBeFalsy();
    });

    test('filter', () => {
        const expected = [new WeakMap(), new Set()];
        const objects = [new Date(), expected[0], new Error('n'), expected[1]];

        const excludeList = new ExcludeList(Date, Error);
        const filtered = excludeList.filterObjects(...objects);

        expect(filtered).toStrictEqual(expected);
    });
});
