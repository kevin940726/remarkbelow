const inline = {
  strong: /__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/g,
  italic: /\b_((?:[^_]|__)+?)_\b|\*((?:\*\*|[\s\S])+?)\*(?!\*)/g,
  code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/g,
  strike: /~~(?=\S)([\s\S]*?\S)~~/g,
  link: /!?\[(inside)\]\(href\)/g,
  _inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/g,
  _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/g,
  url: /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
  blockquote: /^>(?:[\t ]*>)*([\s\w]*)/gm,
  list: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/mg,
  table: /[|]?(\s+[A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]??(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?\r?\n?/gm,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/g,
  img: /(!\[.*?\]\()(.+?)(\))/g,
  taskList: /^-\s\[\s\]\s+([A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\])+/g,
};

inline.link = new RegExp(
  inline.link.source
    .replace('inside', inline._inside.source)
    .replace('href', inline._href.source)
, 'g');

export default {
  inline
};
