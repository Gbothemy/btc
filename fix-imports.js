const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (f.endsWith('.ts') || f.endsWith('.tsx')) files.push(full);
  }
  return files;
}

const files = walk('src');
let count = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix the broken import pattern: `nimport -> actual newline + import
  if (content.includes('`nimport')) {
    content = content.replace(
      /import \{ getServerSession \} from "next-auth";`nimport \{ authOptions \} from "@\/lib\/auth";/g,
      'import { getServerSession } from "next-auth";\nimport { authOptions } from "@/lib/auth";'
    );
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
    count++;
  }
}

console.log('Fixed', count, 'files');
