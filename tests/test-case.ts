import { existsSync, readFileSync } from 'fs';

export class TestCase {
    public static filePath(append = ''): string {
        return `${__dirname}/_files/${append}`;
    }

    public static fileContents(append: string): string {
        return TestCase.fileContent(TestCase.filePath(append));
    }

    public static fileContent(path: string): string {
        if (!existsSync(path)) {
            return '';
        }

        return readFileSync(path).toString();
    }
}
