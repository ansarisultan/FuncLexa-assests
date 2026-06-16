import { useCallback } from 'react';

export function useSvgParser() {
  const parse = useCallback((rawSvg) => {
    try {
      let cleaned = rawSvg
        .replace(/<\?xml.*?\?>/g, '')
        .replace(/<!--.*?-->/g, '')
        .replace(/\s+/g, ' ');

      // Convert common SVG attributes to camelCase
      cleaned = cleaned.replace(
        /(\s)([a-zA-Z-]+)=/g,
        (_, space, attr) => {
          if (attr === 'class') return ' className=';
          if (attr === 'stroke-width') return ' strokeWidth=';
          if (attr === 'stroke-linecap') return ' strokeLinecap=';
          if (attr === 'stroke-linejoin') return ' strokeLinejoin=';
          if (attr === 'stroke-dasharray') return ' strokeDasharray=';
          if (attr === 'fill-rule') return ' fillRule=';
          if (attr === 'clip-rule') return ' clipRule=';
          return `${space}${attr}=`;
        }
      );

      const componentName = 'SvgIcon';
      const code = `const ${componentName} = (props) => (\n  ${cleaned.trim()}\n);\n\nexport default ${componentName};`;
      return code;
    } catch (err) {
      return '// Error parsing SVG';
    }
  }, []);

  return { parse };
}
