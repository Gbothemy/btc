const fs = require('fs');
const path = require('path');

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (f === 'route.ts') files.push(full);
  }
  return files;
}

const routes = walk('src/app/api');
let count = 0;

for (const file of routes) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('from "@/lib/auth"')) continue;

  // Replace import
  content = content.replace(
    /import \{ auth \} from "@\/lib\/auth";/g,
    'import { getServerSession } from "next-auth";\nimport { authOptions } from "@/lib/auth";'
  );
  // Replace usage
  content = content.replace(
    /const session = await auth\(\);/g,
    'const session = await getServerSession(authOptions);'
  );

  fs.writeFileSync(file, content);
  console.log('Updated:', file);
  count++;
}

// Also update dashboard pages
const pages = [
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/plans/page.tsx',
  'src/app/dashboard/referrals/page.tsx',
  'src/app/dashboard/transactions/page.tsx',
  'src/app/dashboard/deposit/page.tsx',
  'src/app/dashboard/withdraw/page.tsx',
  'src/app/dashboard/settings/page.tsx',
];

for (const file of pages) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('from "@/lib/auth"')) continue;

  content = content.replace(
    /import \{ auth(?:, signIn|, signOut)? \} from "@\/lib\/auth";/g,
    'import { getServerSession } from "next-auth";\nimport { authOptions } from "@/lib/auth";'
  );
  content = content.replace(
    /const session = await auth\(\);/g,
    'const session = await getServerSession(authOptions);'
  );

  fs.writeFileSync(file, content);
  console.log('Updated page:', file);
  count++;
}

console.log(`\nTotal updated: ${count} files`);
