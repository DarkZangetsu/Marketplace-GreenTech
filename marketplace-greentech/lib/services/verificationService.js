/**
 * Service de vérification d'email
 * Gère la génération, le stockage et la vérification des codes de vérification
 */

class VerificationService {
  constructor() {
    this.storageKey = 'email_verification_codes';
    this.expirationTime = 10 * 60 * 1000; // 10 minutes en millisecondes
  }

  /**
   * Génère un code de vérification à 6 chiffres
   * @returns {string} Code à 6 chiffres
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Stocke un code de vérification pour un email donné
   * @param {string} email - Email de l'utilisateur
   * @param {string} code - Code de vérification
   */
  storeVerificationCode(email, code) {
    try {
      const codes = this.getStoredCodes();
      const expirationTime = Date.now() + this.expirationTime;
      
      codes[email] = {
        code: code,
        expiresAt: expirationTime,
        attempts: 0,
        maxAttempts: 3
      };

      localStorage.setItem(this.storageKey, JSON.stringify(codes));
      
      console.log(`Code de vérification stocké pour ${email}: ${code} (expire dans 10 minutes)`);
      return true;
    } catch (error) {
      console.error('Erreur lors du stockage du code:', error);
      return false;
    }
  }

  /**
   * Récupère tous les codes stockés (nettoie les codes expirés)
   * @returns {Object} Codes de vérification stockés
   */
  getStoredCodes() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return {};

      const codes = JSON.parse(stored);
      const now = Date.now();
      
      // Nettoyer les codes expirés
      Object.keys(codes).forEach(email => {
        if (codes[email].expiresAt < now) {
          delete codes[email];
        }
      });

      // Sauvegarder les codes nettoyés
      localStorage.setItem(this.storageKey, JSON.stringify(codes));
      
      return codes;
    } catch (error) {
      console.error('Erreur lors de la récupération des codes:', error);
      return {};
    }
  }

  /**
   * Vérifie un code de vérification pour un email donné
   * @param {string} email - Email de l'utilisateur
   * @param {string} inputCode - Code saisi par l'utilisateur
   * @returns {Object} Résultat de la vérification
   */
  verifyCode(email, inputCode) {
    try {
      const codes = this.getStoredCodes();
      const storedData = codes[email];

      if (!storedData) {
        return {
          success: false,
          message: 'Aucun code de vérification trouvé pour cet email. Veuillez demander un nouveau code.'
        };
      }

      // Vérifier si le code a expiré
      if (Date.now() > storedData.expiresAt) {
        delete codes[email];
        localStorage.setItem(this.storageKey, JSON.stringify(codes));
        return {
          success: false,
          message: 'Le code de vérification a expiré. Veuillez demander un nouveau code.'
        };
      }

      // Vérifier le nombre de tentatives
      if (storedData.attempts >= storedData.maxAttempts) {
        delete codes[email];
        localStorage.setItem(this.storageKey, JSON.stringify(codes));
        return {
          success: false,
          message: 'Trop de tentatives incorrectes. Veuillez demander un nouveau code.'
        };
      }

      // Vérifier le code
      if (storedData.code === inputCode.trim()) {
        // Code correct - supprimer de la mémoire
        delete codes[email];
        localStorage.setItem(this.storageKey, JSON.stringify(codes));
        return {
          success: true,
          message: 'Email vérifié avec succès !'
        };
      } else {
        // Code incorrect - incrémenter les tentatives
        storedData.attempts += 1;
        codes[email] = storedData;
        localStorage.setItem(this.storageKey, JSON.stringify(codes));
        
        const remainingAttempts = storedData.maxAttempts - storedData.attempts;
        return {
          success: false,
          message: `Code incorrect. Il vous reste ${remainingAttempts} tentative(s).`
        };
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      return {
        success: false,
        message: 'Erreur lors de la vérification. Veuillez réessayer.'
      };
    }
  }

  /**
   * Supprime un code de vérification pour un email donné
   * @param {string} email - Email de l'utilisateur
   */
  removeVerificationCode(email) {
    try {
      const codes = this.getStoredCodes();
      delete codes[email];
      localStorage.setItem(this.storageKey, JSON.stringify(codes));
    } catch (error) {
      console.error('Erreur lors de la suppression du code:', error);
    }
  }

  /**
   * Vérifie si un code existe pour un email donné
   * @param {string} email - Email de l'utilisateur
   * @returns {boolean} True si un code existe et n'a pas expiré
   */
  hasValidCode(email) {
    const codes = this.getStoredCodes();
    const storedData = codes[email];
    
    if (!storedData) return false;
    if (Date.now() > storedData.expiresAt) return false;
    if (storedData.attempts >= storedData.maxAttempts) return false;
    
    return true;
  }

  /**
   * Obtient le temps restant avant expiration d'un code
   * @param {string} email - Email de l'utilisateur
   * @returns {number} Temps restant en secondes (0 si expiré ou inexistant)
   */
  getTimeRemaining(email) {
    const codes = this.getStoredCodes();
    const storedData = codes[email];
    
    if (!storedData) return 0;
    
    const remaining = Math.max(0, storedData.expiresAt - Date.now());
    return Math.floor(remaining / 1000); // Retourner en secondes
  }

  /**
   * Nettoie tous les codes de vérification
   */
  clearAllCodes() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Erreur lors du nettoyage des codes:', error);
    }
  }
}

// Exporter une instance unique (singleton)
const verificationService = new VerificationService();
export default verificationService;
