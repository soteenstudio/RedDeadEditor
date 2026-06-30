import pluginVue from 'eslint-plugin-vue';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
const customNoCommentRule = {
  meta: {
    type: 'layout',
    docs: { description: 'Remove comments & give breath after header' },
    fixable: 'code',
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      Program(node) {
        const comments = sourceCode.getAllComments();
        comments.forEach((comment) => {
          if (!(comment.type === 'Block' && comment.value.startsWith('*'))) {
            context.report({
              node: comment,
              message: 'Comments are prohibited!',
              fix(fixer) {
                return fixer.remove(comment);
              },
            });
          }
        });
        const firstComment = sourceCode.getAllComments()[0];
        if (firstComment && firstComment.value.includes('Copyright 2026')) {
          const tokenAfter = sourceCode.getTokenAfter(firstComment);
          const range = [firstComment.range[1], tokenAfter.range[0]];
          const textBetween = sourceCode
            .getText()
            .substring(range[0], range[1]);

          if (!textBetween.includes('\n\n')) {
            context.report({
              node: firstComment,
              message: 'Need a blank line after the header',
              fix(fixer) {
                return fixer.insertTextAfter(firstComment, '\n');
              },
            });
          }
        }
      },
    };
  },
};

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,vue}'],
    plugins: {
      custom: {
        rules: {
          'no-comments': customNoCommentRule,
        },
      },
      prettier: eslintPluginPrettier,
    },
    rules: {
      'custom/no-comments': 'error',
      'no-unused-vars': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'prettier/prettier': ['error', {
        "comments": false 
      }],
    },
  },
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
];
