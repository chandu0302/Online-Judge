const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../src/components/compiler/CompilerWorkspace.jsx');
const text = fs.readFileSync(file, 'utf8');
const tagRegex = /<(\/)?([A-Za-z0-9_\-]+)([^>]*)>/g;
let m;
const stack = [];
while ((m = tagRegex.exec(text))) {
  const closing = !!m[1];
  const tag = m[2];
  const attrs = m[3];
  const selfClosing = /\/$/.test(attrs);
  if (!closing && !selfClosing) {
    stack.push({ tag, pos: m.index });
  } else if (closing) {
    const last = stack.pop();
    if (!last) {
      console.log('Unmatched closing', tag, 'at', m.index);
      process.exit(1);
    }
    if (last.tag !== tag) {
      console.log('MISMATCH: expected', last.tag, 'but found closing', tag, 'at', m.index);
      console.log('last pos', last.pos);
      process.exit(1);
    }
  }
}
console.log('Done. Remaining stack length:', stack.length);
if (stack.length) console.log(stack.slice(-10));
