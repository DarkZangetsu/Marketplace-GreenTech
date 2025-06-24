/**
 * Service d'envoi d'emails avec EmailJS
 * Gère l'envoi des codes de vérification par email
 */

import verificationService from './verificationService';

class EmailService {
  constructor() {
    this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    this.templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    this.isInitialized = false;
  }

  /**
   * Initialise EmailJS (charge le script dynamiquement)
   */
  async initializeEmailJS() {
    if (this.isInitialized) return true;

    try {
      // Vérifier si EmailJS est déjà chargé
      if (typeof window !== 'undefined' && window.emailjs) {
        this.isInitialized = true;
        return true;
      }

      // Charger EmailJS dynamiquement
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
          if (window.emailjs) {
            window.emailjs.init(this.publicKey);
            this.isInitialized = true;
            console.log('EmailJS initialisé avec succès');
            resolve(true);
          } else {
            reject(new Error('EmailJS non disponible après le chargement'));
          }
        };
        script.onerror = () => reject(new Error('Erreur lors du chargement d\'EmailJS'));
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Erreur lors de l\'initialisation d\'EmailJS:', error);
      return false;
    }
  }

  /**
   * Valide la configuration EmailJS
   */
  validateConfig() {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      console.error('Configuration EmailJS incomplète:', {
        serviceId: !!this.serviceId,
        templateId: !!this.templateId,
        publicKey: !!this.publicKey
      });
      return false;
    }
    return true;
  }

  /**
   * Envoie un code de vérification par email
   * @param {string} email - Email du destinataire
   * @returns {Promise<Object>} Résultat de l'envoi
   */
  async sendVerificationCode(email) {
    try {
      // Valider la configuration
      if (!this.validateConfig()) {
        return {
          success: false,
          message: 'Configuration EmailJS manquante. Veuillez contacter l\'administrateur.'
        };
      }

      // Initialiser EmailJS
      const initialized = await this.initializeEmailJS();
      if (!initialized) {
        return {
          success: false,
          message: 'Impossible d\'initialiser le service d\'email.'
        };
      }

      // Vérifier si un code valide existe déjà
      if (verificationService.hasValidCode(email)) {
        const timeRemaining = verificationService.getTimeRemaining(email);
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        
        return {
          success: false,
          message: `Un code a déjà été envoyé. Veuillez attendre ${minutes}:${seconds.toString().padStart(2, '0')} avant de demander un nouveau code.`
        };
      }

      // Générer un nouveau code
      const verificationCode = verificationService.generateVerificationCode();
      
      // Préparer les paramètres du template
      const templateParams = {
        email: email,
        passcode: verificationCode,
        time: '10 minutes'
      };

      // Envoyer l'email
      const response = await window.emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      if (response.status === 200) {
        // Stocker le code en cache
        const stored = verificationService.storeVerificationCode(email, verificationCode);
        
        if (stored) {
          return {
            success: true,
            message: 'Code de vérification envoyé avec succès ! Vérifiez votre boîte email.'
          };
        } else {
          return {
            success: false,
            message: 'Email envoyé mais erreur de stockage. Veuillez réessayer.'
          };
        }
      } else {
        throw new Error(`Erreur EmailJS: ${response.status}`);
      }

    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      // Messages d'erreur plus spécifiques
      if (error.message.includes('network')) {
        return {
          success: false,
          message: 'Erreur de connexion. Vérifiez votre connexion internet.'
        };
      } else if (error.message.includes('template')) {
        return {
          success: false,
          message: 'Erreur de configuration du template email.'
        };
      } else {
        return {
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.'
        };
      }
    }
  }

  /**
   * Renvoie un code de vérification
   * @param {string} email - Email du destinataire
   * @returns {Promise<Object>} Résultat de l'envoi
   */
  async resendVerificationCode(email) {
    // Supprimer l'ancien code
    verificationService.removeVerificationCode(email);

    // Envoyer un nouveau code
    return await this.sendVerificationCode(email);
  }

  /**
   * Teste la configuration EmailJS
   * @returns {Promise<Object>} Résultat du test
   */
  async testConfiguration() {
    try {
      if (!this.validateConfig()) {
        return {
          success: false,
          message: 'Configuration EmailJS incomplète'
        };
      }

      const initialized = await this.initializeEmailJS();
      if (!initialized) {
        return {
          success: false,
          message: 'Impossible d\'initialiser EmailJS'
        };
      }

      return {
        success: true,
        message: 'Configuration EmailJS valide'
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de configuration: ${error.message}`
      };
    }
  }
}

// Exporter une instance unique (singleton)
const emailService = new EmailService();
export default emailService;
