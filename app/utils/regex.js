/* eslint-disable max-len */

const inline = {
  strong: /__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/g,
  italic: /\b_((?:[^_]|__)+?)_\b|\*((?:\*\*|[\s\S])+?)\*(?!\*)/g,
  code: /(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/g,
  strike: /~~(?=\S)([\s\S]*?\S)~~/g,
  link: /!?\[(inside)\]\(href\)/g,
  inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/g,
  href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/g,
  url: /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
  blockquote: /^>(?:[\t ]*>)*(.*)/g,
  list: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/mg,
  table: /[|]?(\s+[A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]??(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?\r?\n?/gm,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/g,
  img: /(!\[.*?\]\()(.+?)(\))/g,
  taskList: /^-\s\[\s\]\s+([A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\])+/g,
  taskListx: /^-\s\[x\]\s+([A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\])+/g,
};

inline.link = new RegExp(
  inline.link.source
    .replace('inside', inline.inside.source)
    .replace('href', inline.href.source)
, 'g');

const block = {
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/g,
  blockquote: /^(>(?:[\t ]*>)*\s)(.*)/g,
  list: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/mg,
  table: /[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?[|]?(\s+[A-Za-z0-9 -_*#@$%:;?!`\(\).,\/\\]+\s+)[|]?\r?\n?/g,
};

export default {
  inline,
  block,
};
