'use strict';

var helpers = require('../helpers');

/**
 * Determine if node is a specified psuedo class type
 *
 * @param {string} type - The specified pseudo class type to check against
 * @param {Object} node - The node to check
 * @returns {bool} True or false
 */
var isPseudoType = function (type, node) {
  var selector = node.first('selector');

  if (selector.contains('pseudoClass')) {
    var pseudoClass = selector.first('pseudoClass');

    if (pseudoClass.contains('ident')) {
      var pseudoString = pseudoClass.first('ident');

      return pseudoString.content === type;
    }
  }
  return false;
};

/**
 * Determine if node is focus pseudo class
 *
 * @param {Object} node - The node to check
 * @returns {bool} True or false
 */
var isFocus = function (node) {
  return isPseudoType('focus', node);
};

/**
 * Determine if node is hover pseudo class
 *
 * @param {Object} node - The node to check
 * @returns {bool} True or false
 */
var isHover = function (node) {
  return isPseudoType('hover', node);
};

/**
 * Run the rule checks and store return their results
 *
 * @param {Object} node - TODO
 * @returns {Object} The results of the rule checks
 */
var runRuleChecks = function (node) {
  var checks = {};

  node.forEach('ruleset', function (child) {
    if (isFocus(child)) {
      checks.hasFocus = true;
    }

    if (isHover(child)) {
      checks.hasHover = true;
    }
  });

  return checks;
};

/**
 * Create an issue using the supplied information
 *
 * @param {Object} parser - The parser
 * @param {Object} node - The node with the issue
 * @param {string} message - The message to display
 * @param {string} syntax - Syntax of file (Sass/SCSS)
 * @returns {Object} An object containing an issue
 */
var createIssue = function (parser, node, message, syntax) {
  var block = syntax === 'scss' ? node : {};

  if (syntax === 'sass') {
    block.start = {
      line: node.start.line - 1,
      column: node.start.column
    };
  }

  return {
    'ruleId': parser.rule.name,
    'line': block.start.line,
    'column': block.start.column,
    'message': message,
    'severity': parser.severity
  };
};

module.exports = {
  'name': 'focus-and-hover',
  'defaults': {},
  'detect': function (ast, parser) {
    var result = [];

    ast.traverseByType('ruleset', function (node) {
      var currentBlock,
          checks = {
            hasFocus: null,
            hasHover: null
          };

      // Filter out any focus or hover pseudo classes
      if (isFocus(node) || isHover(node)) {
        return false;
      }

      // Get the block of our node
      currentBlock = node.first('block') || false;

      // Run rule checks and store the results
      checks = runRuleChecks(currentBlock);

      // Only continue if we have either a focus or a hover pseudo class
      if (checks.hasFocus || checks.hasHover) {
        if (checks.hasFocus && !checks.hasHover) {
          result = helpers.addUnique(
            result,
            createIssue(parser, currentBlock, 'Hover pseudo-class required', ast.syntax)
          );
        }

        if (!checks.hasFocus && checks.hasHover) {
          result = helpers.addUnique(
            result,
            createIssue(parser, currentBlock, 'Focus pseudo-class required', ast.syntax)
          );
        }
      }
    });

    return result;
  }
};
