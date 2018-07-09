import cssParser from 'css';
import sass from 'node-sass';

/**
 * Converts css properties to upperCase e.g.
 * background-color -> backgroundColor
 */
const getDeclarationProperty = function( property )
{
  let propertyCharacters = property.split('');
  propertyCharacters = propertyCharacters.map( ( char, index ) => {
      return propertyCharacters[ index - 1 ] === '-' ? char.toUpperCase() : char;
  } );
  return propertyCharacters.join( '' ).replace(/\-/g, '' );
}

/**
 * Transform css rules to react friendly objects
 */
const transformRules = function( self, rules )
{
    const result = {};
    rules.forEach( rule => {
        const obj = {};
        if (rule.type === 'media')
        {
            const name = mediaNameGenerator(rule.media);
            const media = result[name] = result[name] || {
                "__expression__": rule.media
            };
            transformRules(self, rule.rules, media)
        }
        else if (rule.type === 'rule') {
            rule.declarations.forEach( declaration => {
                if (declaration.type === 'declaration') {
                    const declProperty = getDeclarationProperty( declaration.property );
                    obj[declProperty] = declaration.value;
                }
            });
            rule.selectors.forEach( selector => {
                var name = nameGenerator(selector.trim());
                result[name] = obj;
            });
        }
    });
    return result;
}

const mediaNameGenerator = function(name) {
    return '@media ' + name;
};

const nameGenerator = function(name) {
    name = name.replace(/\s\s+/g, ' ');
    name = name.replace(/[^a-zA-Z0-9]/g, '_');
    name = name.replace(/^_+/g, '');
    name = name.replace(/_+$/g, '');
    return name;
};

const transform = function( inputCssText )
{
  const res = sass.renderSync( { data: inputCssText } );
  const cssToParse = res.css.toString();

  const css = cssParser.parse(cssToParse);
  const result = transformRules( this, css.stylesheet.rules );

  return result;
}

module.exports = function ( source )
{
  const result = transform( source );
  return 'module.exports = ' + JSON.stringify( result ) + ';';
}
