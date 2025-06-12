#!/usr/bin/env node

/**
 * Script pour détecter et corriger automatiquement les event handlers problématiques
 * Usage: node scripts/fix-event-handlers.js
 */

const fs = require('fs');
const path = require('path');

// Dossiers à scanner
const SCAN_DIRS = ['app', 'lib', 'components'];

// Extensions de fichiers à traiter
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Patterns problématiques à détecter
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /\(e\)\s*=>/g,
    replacement: '(event) =>',
    description: 'Event handler avec paramètre "e"'
  },
  {
    pattern: /\(e,/g,
    replacement: '(event,',
    description: 'Event handler avec premier paramètre "e"'
  },
  {
    pattern: /function\s*\(\s*e\s*\)/g,
    replacement: 'function(event)',
    description: 'Function avec paramètre "e"'
  },
  {
    pattern: /\.addEventListener\s*\(\s*['"][^'"]*['"],\s*\(\s*e\s*\)/g,
    replacement: (match) => match.replace('(e)', '(event)'),
    description: 'addEventListener avec paramètre "e"'
  }
];

// Patterns spécifiques à éviter (pour ne pas casser le code)
const SAFE_PATTERNS = [
  /console\.error/,
  /console\.log/,
  /\.preventDefault/,
  /\.stopPropagation/,
  /event\./,
  /event\[/
];

// Compteurs
let filesScanned = 0;
let filesFixed = 0;
let issuesFound = 0;
let issuesFixed = 0;

/**
 * Vérifie si un fichier doit être traité
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return FILE_EXTENSIONS.includes(ext) && 
         !filePath.includes('node_modules') &&
         !filePath.includes('.next') &&
         !filePath.includes('dist');
}

/**
 * Vérifie si une ligne est sûre à modifier
 */
function isSafeToModify(line) {
  return !SAFE_PATTERNS.some(pattern => pattern.test(line));
}

/**
 * Corrige les event handlers dans le contenu
 */
function fixEventHandlers(content, filePath) {
  let modifiedContent = content;
  let fileIssuesFound = 0;
  let fileIssuesFixed = 0;
  
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    PROBLEMATIC_PATTERNS.forEach(({ pattern, replacement, description }) => {
      if (pattern.test(line)) {
        fileIssuesFound++;
        
        if (isSafeToModify(line)) {
          const newLine = typeof replacement === 'function' 
            ? line.replace(pattern, replacement)
            : line.replace(pattern, replacement);
          
          if (newLine !== line) {
            modifiedContent = modifiedContent.replace(line, newLine);
            fileIssuesFixed++;
            console.log(`     Ligne ${index + 1}: ${description}`);
            console.log(`     Avant: ${line.trim()}`);
            console.log(`     Après: ${newLine.trim()}`);
          }
        } else {
          console.log(`    Ligne ${index + 1}: ${description} (ignoré pour sécurité)`);
          console.log(`     Contenu: ${line.trim()}`);
        }
      }
    });
  });
  
  issuesFound += fileIssuesFound;
  issuesFixed += fileIssuesFixed;
  
  return {
    content: modifiedContent,
    issuesFound: fileIssuesFound,
    issuesFixed: fileIssuesFixed
  };
}

/**
 * Traite un fichier
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixEventHandlers(content, filePath);
    
    filesScanned++;
    
    if (result.issuesFound > 0) {
      console.log(`\n ${filePath}`);
      console.log(`   Problèmes trouvés: ${result.issuesFound}`);
      console.log(`   Problèmes corrigés: ${result.issuesFixed}`);
      
      if (result.issuesFixed > 0) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        filesFixed++;
      }
    }
    
  } catch (error) {
    console.error(` Erreur lors du traitement de ${filePath}:`, error.message);
  }
}

/**
 * Scanne récursivement un dossier
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        // Ignorer certains dossiers
        if (!item.startsWith('.') && 
            item !== 'node_modules' && 
            item !== '.next' &&
            item !== 'dist') {
          scanDirectory(itemPath);
        }
      } else if (stats.isFile() && shouldProcessFile(itemPath)) {
        processFile(itemPath);
      }
    });
  } catch (error) {
    console.error(`❌ Erreur lors du scan de ${dirPath}:`, error.message);
  }
}

/**
 * Fonction principale
 */
function main() {
  console.log(' Détection et correction des event handlers problématiques...\n');
  
  const startTime = Date.now();
  
  // Scanner chaque dossier
  SCAN_DIRS.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      console.log(` Scan du dossier: ${dir}`);
      scanDirectory(dirPath);
    } else {
      console.log(` Dossier non trouvé: ${dir}`);
    }
  });
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n Résumé:');
  console.log(`   Fichiers scannés: ${filesScanned}`);
  console.log(`   Fichiers modifiés: ${filesFixed}`);
  console.log(`   Problèmes trouvés: ${issuesFound}`);
  console.log(`   Problèmes corrigés: ${issuesFixed}`);
  console.log(`   Temps d'exécution: ${duration}s`);
  
  if (issuesFixed > 0) {
    console.log('\n Corrections appliquées avec succès!');
    console.log(' Vos event handlers sont maintenant sécurisés.');
    console.log('\n Prochaines étapes:');
    console.log('   1. Testez votre application');
    console.log('   2. Vérifiez la console du navigateur');
    console.log('   3. Commitez les changements');
  } else if (issuesFound > 0) {
    console.log('\n  Problèmes détectés mais non corrigés automatiquement');
    console.log('   Vérifiez manuellement les fichiers signalés');
  } else {
    console.log('\n Aucun problème détecté - votre code est déjà propre!');
  }
  
  // Recommandations
  if (issuesFound > 0) {
    console.log('\n  Recommandations pour éviter ces problèmes:');
    console.log('   • Utilisez "event" au lieu de "e" dans les handlers');
    console.log('   • Utilisez des noms explicites: keyboardEvent, mouseEvent, etc.');
    console.log('   • Configurez ESLint pour détecter ces patterns');
    console.log('   • Utilisez TypeScript pour une meilleure sécurité de types');
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { fixEventHandlers, processFile };
