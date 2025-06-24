#!/usr/bin/env node

/**
 * Script pour nettoyer le cache d'authentification
 * Utilise ce script quand tu changes d'environnement (local <-> production)
 */

console.log('🧹 Nettoyage du cache d\'authentification...\n');

// Instructions pour l'utilisateur
console.log('📋 Instructions :');
console.log('1. Ouvre la console de ton navigateur (F12)');
console.log('2. Va dans l\'onglet "Application" ou "Storage"');
console.log('3. Trouve "Local Storage" -> "http://localhost:3000"');
console.log('4. Supprime les clés suivantes :');
console.log('   - token');
console.log('   - user');
console.log('   - refreshToken (si présent)');
console.log('\n🔄 Ou exécute cette commande dans la console du navigateur :');
console.log('localStorage.removeItem("token"); localStorage.removeItem("user"); localStorage.removeItem("refreshToken"); location.reload();');

console.log('\n✅ Après avoir nettoyé le localStorage :');
console.log('1. Redémarre le serveur Next.js (Ctrl+C puis npm run dev)');
console.log('2. Assure-toi que ton backend Django fonctionne sur localhost:8000');
console.log('3. Rafraîchis la page (F5)');

console.log('\n🔧 Vérification de l\'environnement :');
console.log(`NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'Non défini'}`);
console.log(`NEXT_PUBLIC_GRAPHQL_URL: ${process.env.NEXT_PUBLIC_GRAPHQL_URL || 'Non défini'}`);

console.log('\n⚠️  Note importante :');
console.log('Cette erreur arrive quand tu changes d\'environnement car les tokens JWT');
console.log('sont signés avec des clés différentes entre localhost et Render.');
