const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.sqlite');
const WORKSPACE_DIR = path.join(__dirname, '../..');

function openDb() {
  return new sqlite3.Database(DB_PATH);
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

const DOCUMENT_EXTENSIONS = ['.md', '.txt', '.json', '.js', '.ts', '.tsx', '.jsx', '.css', '.html', '.yml', '.yaml'];

async function importDocument(filePath, relativePath) {
  const db = openDb();
  
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Skip if not a document type or too large
    if (!DOCUMENT_EXTENSIONS.includes(ext) || stats.size > 100000) {
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    // Skip node_modules and .git
    if (relativePath.includes('node_modules') || relativePath.includes('.git') || relativePath.includes('.next')) {
      return;
    }
    
    await run(
      db,
      'INSERT OR IGNORE INTO documents (title, content, file_path, file_type, metadata) VALUES (?, ?, ?, ?, ?)',
      [
        fileName,
        content.slice(0, 10000), // Limit content size
        relativePath,
        ext.replace('.', '').toUpperCase(),
        JSON.stringify({ size: stats.size, imported: new Date().toISOString() })
      ]
    );
    
    console.log(`Imported: ${relativePath}`);
  } catch (err) {
    console.error(`Failed to import ${relativePath}:`, err.message);
  } finally {
    db.close();
  }
}

async function scanDirectory(dir, baseDir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.relative(baseDir, fullPath);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', '.next', 'dist', 'build', 'coverage'].includes(item)) {
        continue;
      }
      await scanDirectory(fullPath, baseDir);
    } else if (stat.isFile()) {
      await importDocument(fullPath, relativePath);
    }
  }
}

async function main() {
  console.log('Starting document import...');
  
  // Import key files from workspace
  const keyDirs = [
    path.join(WORKSPACE_DIR, 'businesses'),
    path.join(WORKSPACE_DIR, 'memory'),
    path.join(WORKSPACE_DIR, 'second-brain')
  ];
  
  for (const dir of keyDirs) {
    if (fs.existsSync(dir)) {
      console.log(`Scanning ${dir}...`);
      await scanDirectory(dir, WORKSPACE_DIR);
    }
  }
  
  // Import specific important files
  const importantFiles = [
    'AGENTS.md',
    'TOOLS.md',
    'MEMORY.md',
    'README.md'
  ];
  
  for (const file of importantFiles) {
    const filePath = path.join(WORKSPACE_DIR, file);
    if (fs.existsSync(filePath)) {
      await importDocument(filePath, file);
    }
  }
  
  console.log('Document import completed!');
}

main().catch(console.error);
