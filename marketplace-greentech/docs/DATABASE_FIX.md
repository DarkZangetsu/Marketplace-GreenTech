# 🔧 Résolution du problème "read only replica"

## ❌ **Problème identifié**

```
Error sending message: You can't write against a read only replica.
```

Cette erreur indique que votre base de données PostgreSQL sur Render est configurée en mode lecture seule (replica).

## 🎯 **Solutions**

### **Solution 1 : Vérifier la configuration Render (Recommandée)**

1. **Connectez-vous à votre dashboard Render**
   - Allez sur [dashboard.render.com](https://dashboard.render.com)

2. **Vérifiez votre service de base de données**
   - Cliquez sur votre service PostgreSQL
   - Vérifiez que c'est bien une base de données **primaire** et non une **replica**

3. **Vérifiez l'URL de connexion**
   - Dans votre service web Django, vérifiez la variable `DATABASE_URL`
   - Assurez-vous qu'elle pointe vers la base **primaire** et non vers une replica

### **Solution 2 : Recréer la base de données**

Si votre base est en mode replica :

1. **Sauvegardez vos données** (si importantes)
2. **Supprimez l'ancienne base de données**
3. **Créez une nouvelle base PostgreSQL**
   - Type : **PostgreSQL** (pas PostgreSQL Replica)
   - Plan : Gratuit ou payant selon vos besoins

### **Solution 3 : Vérifier les variables d'environnement**

Dans votre service web Render, vérifiez :

```env
# ✅ Correct - URL de base primaire
DATABASE_URL=postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com/database_name

# ❌ Incorrect - URL de replica (contient souvent 'replica' ou 'read')
DATABASE_URL=postgresql://user:password@dpg-xxxxx-a.oregon-postgres-replica.render.com/database_name
```

## 🔧 **3. Problème WebSocket**

### **Vérification de la configuration Redis**

1. **Vérifiez que Redis est créé et actif**
   - Service Redis sur Render
   - Variable `REDIS_URL` configurée

2. **Vérifiez l'URL WebSocket**
   ```env
   # ✅ Correct
   NEXT_PUBLIC_WS_URL=wss://marketplace-greentech.onrender.com
   
   # ❌ Incorrect
   NEXT_PUBLIC_WS_URL=ws://marketplace-greentech.onrender.com
   ```

3. **Vérifiez les settings Django**
   ```python
   # greentech/settings_production.py
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {
               "hosts": [os.environ.get('REDIS_URL')],
           },
       },
   }
   ```

## 🚀 **4. Étapes de résolution complète**

### **Étape 1 : Vérifier Render Dashboard**
1. Base de données PostgreSQL (primaire, pas replica)
2. Service Redis actif
3. Variables d'environnement correctes

### **Étape 2 : Redéployer si nécessaire**
```bash
# Si vous changez les variables d'environnement
# Le redéploiement se fait automatiquement
```

### **Étape 3 : Tester la connexion**
1. Testez l'API GraphQL : `https://marketplace-greentech.onrender.com/graphql/`
2. Testez l'envoi de messages
3. Testez les WebSockets

## 🔍 **5. Diagnostic**

### **Vérifier les logs Render**
1. Allez dans votre service web
2. Onglet "Logs"
3. Cherchez les erreurs de connexion à la base

### **Tester l'API directement**
```bash
# Test GraphQL
curl -X POST https://marketplace-greentech.onrender.com/graphql/ \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

## ✅ **6. Vérification finale**

Une fois corrigé, vous devriez pouvoir :
- ✅ Envoyer des messages
- ✅ Recevoir des messages en temps réel
- ✅ Créer/modifier des annonces
- ✅ Mettre à jour le profil

## 📞 **Support**

Si le problème persiste :
1. Vérifiez les logs Render
2. Contactez le support Render
3. Considérez un plan payant pour une base de données dédiée

---

**Note** : Les plans gratuits de Render peuvent avoir des limitations. Pour une application en production, considérez un plan payant pour des performances optimales.
