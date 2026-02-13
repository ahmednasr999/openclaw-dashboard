const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.sqlite');
const MEMORY_DIR = path.join(__dirname, '../../memory');
const MEMORY_FILE = path.join(__dirname, '../../MEMORY.md');

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

async function importMemoryFile(filePath, source) {
  const db = openDb();
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let currentTitle = '';
    let currentContent = '';
    let currentCategory = '';
    
    for (const line of lines) {
      // Check for headers that could be memory titles
      if (line.startsWith('# ')) {
        // Save previous memory if exists
        if (currentTitle && currentContent.trim()) {
          await run(
            db,
            'INSERT INTO memories (title, content, category, tags, source) VALUES (?, ?, ?, ?, ?)',
            [currentTitle, currentContent.trim(), currentCategory, '', source]
          );
        }
        currentTitle = line.replace('# ', '').trim();
        currentContent = '';
        currentCategory = '';
      } else if (line.startsWith('## ')) {
        // Could be category or sub-header
        if (!currentCategory) {
          currentCategory = line.replace('## ', '').trim();
        }
        currentContent += line + '\n';
      } else {
        currentContent += line + '\n';
      }
    }
    
    // Save last memory
    if (currentTitle && currentContent.trim()) {
      await run(
        db,
        'INSERT INTO memories (title, content, category, tags, source) VALUES (?, ?, ?, ?, ?)',
        [currentTitle, currentContent.trim(), currentCategory, '', source]
      );
    }
    
    // Also save the whole file as a single memory if it has good content
    if (content.length > 100) {
      const fileName = path.basename(filePath, '.md');
      await run(
        db,
        'INSERT OR IGNORE INTO memories (title, content, category, tags, source) VALUES (?, ?, ?, ?, ?)',
        [
          `Memory: ${fileName}`,
          content.slice(0, 5000),
          'Daily Log',
          'imported',
          source
        ]
      );
    }
    
    console.log(`Imported: ${source}`);
  } catch (err) {
    console.error(`Failed to import ${source}:`, err.message);
  } finally {
    db.close();
  }
}

async function main() {
  console.log('Starting memory import...');
  
  // Import MEMORY.md if exists
  if (fs.existsSync(MEMORY_FILE)) {
    console.log('Importing MEMORY.md...');
    await importMemoryFile(MEMORY_FILE, 'MEMORY.md');
  }
  
  // Import daily memory files
  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs.readdirSync(MEMORY_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md') && f.match(/^\d{4}-\d{2}-\d{2}\.md$/));
    
    console.log(`Found ${mdFiles.length} daily memory files`);
    
    for (const file of mdFiles.slice(-30)) { // Last 30 days
      const filePath = path.join(MEMORY_DIR, file);
      await importMemoryFile(filePath, file);
    }
  }
  
  console.log('Memory import completed!');
}

main().catch(console.error);
