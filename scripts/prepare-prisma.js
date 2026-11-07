const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf8');

// Determine desired provider from DATABASE_URL
const dbUrl = process.env.DATABASE_URL || '';
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');
const targetProvider = isPostgres ? 'postgresql' : (process.env.PRISMA_PROVIDER || 'sqlite');

console.log(`[prepare-prisma] Detected database target: ${targetProvider}`);

// Replace provider in datasource db block
const currentProviderMatch = schema.match(/datasource\s+db\s*\{[\s\S]*?provider\s*=\s*"([^"]+)"/);
if (currentProviderMatch && currentProviderMatch[1] !== targetProvider) {
  schema = schema.replace(
    /(datasource\s+db\s*\{[\s\S]*?provider\s*=\s*)"[^"]+"/,
    `$1"${targetProvider}"`
  );
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log(`[prepare-prisma] Updated prisma/schema.prisma provider to "${targetProvider}"`);
} else {
  console.log(`[prepare-prisma] prisma/schema.prisma provider is already "${targetProvider}"`);
}

// Generate client
try {
  console.log('[prepare-prisma] Running "prisma generate"...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (err) {
  console.error('[prepare-prisma] Error running prisma generate:', err.message);
  process.exit(1);
}

