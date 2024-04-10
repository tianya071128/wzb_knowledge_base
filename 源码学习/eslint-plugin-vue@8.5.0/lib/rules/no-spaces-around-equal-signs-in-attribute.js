/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/460
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'disallow spaces around equal signs in attribute',
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-spaces-around-equal-signs-in-attribute.html'
    },
    fixable: 'whitespace',
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        if (!node.value) {
          return
        }
        /** @type {Range} */
        const range = [node.key.range[1], node.value.range[0]]
        const eqText = sourceCode.text.slice(range[0], range[1])
        const expect = eqText.trim()

        if (eqText !== expect) {
          context.report({
            node: node.key,
            loc: {
              start: node.key.loc.end,
              end: node.value.loc.start
            },
            message: 'Unexpected spaces found around equal signs.',
            data: {},
            fix: (fixer) => fixer.replaceTextRange(range, expect)
          })
        }
      }
    })
  }
}
