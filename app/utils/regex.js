/* eslint-disable max-len */

const inline = {
  strong: /__([\s\S]+?)__(?!_)|\*\*([\s\S]+?)\*\*(?!\*)/g,
  italic: /\b_((?:[^_]|__)+?)_\b|\*((?:\*\*|[\s\S])+?)\*(?!\*)/g,
  code: /(`)\s*([\s\S]*?[^`])\s*\1(?!`)/g,
  strike: /~~(?=\S)([\s\S]*?\S)~~/g,
  link: /\[(inside)\]\(href\)/g,
  inside: /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/g,
  href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/g,
  url: /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g,
  indentation: /^( {4}[^\n]+\n*)+/g,
  img: /<img[^>]+src="([^">]+)" title="([^">]+)" alt="([^">]+)" \/>/g,
};

inline.link = new RegExp(
  inline.link.source
    .replace('inside', inline.inside.source)
    .replace('href', inline.href.source)
, 'g');

const block = {
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/g,
  hr: /^( *[-*_=]){3,} *(?:\n+|$)/g,
  list: /(?:^ *(?:[*+-]|\d+\.)(?=[\t ].) \w*$[\r\n]{0,1}){1,}/gm,
  listItems: /(?:^( *)(?:[*+-]|\d+\.)(?=[\t ].) (\w*)$[\r\n]{0,1})/gm,
  blockquote: /(?:^>[\t ]*[A-ZaZa-z0-9 ~!@#$%^&*()_+}{":?><]*[\r\n]{0,1}){1,}/gm,
  table: /^(?:(?:\|*[A-ZaZa-z0-9 -_*#@$%:;?!`\(\),\/\\]+\|+){1,}[\r\n]{0,1}){1,}/gm,
  img: /^!\[(.*)?\]\((.+?)( ['"](.*)['"])?(\)) *$/g,
  taskList: /^-\s\[\s\]\s+([A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\])+/g,
  taskListx: /^-\s\[x\]\s+([A-ZaZa-z0-9 -_*#@$%:;?!`\(\).,\/\\])+/g,
  codeBlock: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *$/gm,
  codeBlockStart: /^ *(`{3,}|~{3,})[ \.]*(\S+)? */,
  codeBlockEnd: /^ *(`{3,}|~{3,}) *$/,
};

export default {
  inline,
  block,
};
