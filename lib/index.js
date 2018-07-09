'use strict';

var _css = require('css');

var _css2 = _interopRequireDefault(_css);

var _nodeSass = require('node-sass');

var _nodeSass2 = _interopRequireDefault(_nodeSass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Converts css properties to upperCase e.g.
 * background-color -> backgroundColor
 */
var getDeclarationProperty = function getDeclarationProperty(property) {
    var propertyCharacters = property.split('');
    propertyCharacters = propertyCharacters.map(function (char, index) {
        return propertyCharacters[index - 1] === '-' ? char.toUpperCase() : char;
    });
    return propertyCharacters.join('').replace(/\-/g, '');
};

/**
 * Transform css rules to react friendly objects
 */
var transformRules = function transformRules(self, rules) {
    var result = {};
    rules.forEach(function (rule) {
        var obj = {};
        if (rule.type === 'media') {
            var name = mediaNameGenerator(rule.media);
            var media = result[name] = result[name] || {
                "__expression__": rule.media
            };
            transformRules(self, rule.rules, media);
        } else if (rule.type === 'rule') {
            rule.declarations.forEach(function (declaration) {
                if (declaration.type === 'declaration') {
                    var declProperty = getDeclarationProperty(declaration.property);
                    obj[declProperty] = declaration.value;
                }
            });
            rule.selectors.forEach(function (selector) {
                var name = nameGenerator(selector.trim());
                result[name] = obj;
            });
        }
    });
    return result;
};

var mediaNameGenerator = function mediaNameGenerator(name) {
    return '@media ' + name;
};

var nameGenerator = function nameGenerator(name) {
    name = name.replace(/\s\s+/g, ' ');
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/g, '');
    name = name.replace(/_+$/g, '');
    return name;
};

var transform = function transform(inputCssText) {
    var res = _nodeSass2.default.renderSync({ data: inputCssText });
    var cssToParse = res.css.toString();

    var css = _css2.default.parse(cssToParse);
    var result = transformRules(this, css.stylesheet.rules);

    return result;
};

module.exports = function (source) {
    var result = transform(source);
    return 'module.exports = ' + JSON.stringify(result) + ';';
};