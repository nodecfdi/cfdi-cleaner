// @ts-check
import nodecfdiConfig from '@nodecfdi/eslint-config';

const { defineConfig } = nodecfdiConfig(import.meta.dirname, { vitest: true });

export default defineConfig({
  rules: {
    'import-x/no-named-as-default-member': 'off',
  },
});
