#!/usr/bin/env node

/**
 * Script de test WebSocket pour Render
 * Usage: node scripts/test-websocket.js [USER_ID]
 */

const WebSocket = require('ws');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://marketplace-greentech.onrender.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-greentech.onrender.com';
const USER_ID = process.argv[2] || '1';
const TEST_TOKEN = process.argv[3] || '';

console.log('Test de connectivité WebSocket pour Render\n');

/**
 * Test de l'API HTTP d'abord
 */
async function testHttpApi() {
  console.log('Test de l\'API HTTP...');
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${API_URL}/graphql/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: '{ __schema { types { name } } }' 
      })
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`API accessible (${latency}ms)`);
      return true;
    } else {
      console.log(`API erreur: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`API inaccessible: ${error.message}`);
    return false;
  }
}

/**
 * Test de la connexion WebSocket
 */
function testWebSocket() {
  return new Promise((resolve) => {
    console.log('\n🔌 Test de la connexion WebSocket...');
    
    const wsUrl = `${BASE_URL}/ws/messages/${USER_ID}/` + 
                  (TEST_TOKEN ? `?token=${encodeURIComponent(TEST_TOKEN)}` : '');
    
    console.log(`URL: ${wsUrl.replace(/token=[^&]+/, 'token=***')}`);
    
    const ws = new WebSocket(wsUrl);
    const startTime = Date.now();
    let resolved = false;
    
    // Timeout de 30 secondes
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log('⏰ Timeout de connexion (30s)');
        ws.close();
        resolve(false);
      }
    }, 30000);
    
    ws.on('open', () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        const latency = Date.now() - startTime;
        console.log(`WebSocket connecté (${latency}ms)`);
        
        // Test d'envoi de message
        try {
          ws.send(JSON.stringify({ type: 'ping' }));
          console.log('Ping envoyé');
        } catch (error) {
          console.log(`Erreur envoi ping: ${error.message}`);
        }
        
        // Fermer après 2 secondes
        setTimeout(() => {
          ws.close();
          resolve(true);
        }, 2000);
      }
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        console.log(`Message reçu: ${message.type || 'unknown'}`);
      } catch (error) {
        console.log(`Message reçu (raw): ${data}`);
      }
    });
    
    ws.on('error', (error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.log(`Erreur WebSocket: ${error.message}`);
        resolve(false);
      }
    });
    
    ws.on('close', (code, reason) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        console.log(`WebSocket fermé: ${code} - ${reason || 'Pas de raison'}`);
        resolve(code === 1000);
      }
    });
  });
}

/**
 * Test de réveil du service
 */
async function wakeUpService() {
  console.log('Tentative de réveil du service...');
  
  const maxAttempts = 3;
  for (let i = 1; i <= maxAttempts; i++) {
    console.log(`   Tentative ${i}/${maxAttempts}...`);
    
    const success = await testHttpApi();
    if (success) {
      console.log('Service réveillé');
      return true;
    }
    
    if (i < maxAttempts) {
      console.log('   Attente 5 secondes...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('Impossible de réveiller le service');
  return false;
}

/**
 * Fonction principale
 */
async function main() {
  console.log(`Configuration:`);
  console.log(`  API URL: ${API_URL}`);
  console.log(`  WebSocket URL: ${BASE_URL}`);
  console.log(`  User ID: ${USER_ID}`);
  console.log(`  Token: ${TEST_TOKEN ? 'Fourni' : 'Non fourni'}`);
  console.log('');
  
  // 1. Tester l'API HTTP
  const apiWorking = await testHttpApi();
  
  if (!apiWorking) {
    // Tenter de réveiller le service
    const wakeUpSuccess = await wakeUpService();
    if (!wakeUpSuccess) {
      console.log('\n❌ Test échoué: API inaccessible');
      process.exit(1);
    }
  }
  
  // 2. Attendre un peu pour que le service soit prêt
  console.log('\n⏳ Attente 3 secondes pour que le service soit prêt...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // 3. Tester WebSocket
  const wsWorking = await testWebSocket();
  
  // 4. Résumé
  console.log('\n📊 Résumé des tests:');
  console.log(`  API HTTP: ${apiWorking ? '✅ OK' : '❌ Échec'}`);
  console.log(`  WebSocket: ${wsWorking ? '✅ OK' : '❌ Échec'}`);
  
  if (apiWorking && wsWorking) {
    console.log('\n🎉 Tous les tests sont passés !');
    process.exit(0);
  } else {
    console.log('\n❌ Certains tests ont échoué');
    console.log('\n💡 Suggestions:');
    
    if (!apiWorking) {
      console.log('  • Vérifiez que le service Django est démarré sur Render');
      console.log('  • Vérifiez les variables d\'environnement');
    }
    
    if (!wsWorking) {
      console.log('  • Vérifiez que Redis est configuré et actif');
      console.log('  • Vérifiez la configuration ASGI/Daphne');
      console.log('  • Le service peut être en cours de réveil (plan gratuit)');
    }
    
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

// Exécuter le script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale:', error.message);
    process.exit(1);
  });
}
