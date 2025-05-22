/* eslint-disable react/no-unescaped-entities */
import React from 'react'

export default function FAQContact() {
  return (
    <div>
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comment puis-je publier une annonce?</h3>
                <p className="text-gray-600">
                  Pour publier une annonce, vous devez d'abord créer un compte. Ensuite, accédez à votre tableau de bord et cliquez sur 
                  "Déposer une annonce". Remplissez le formulaire avec les détails de votre matériau et téléchargez des photos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Est-ce que l'utilisation de la plateforme est gratuite?</h3>
                <p className="text-gray-600">
                  Oui, l'inscription et la publication d'annonces sont entièrement gratuites. Notre objectif est de faciliter 
                  la réutilisation des matériaux, pas de générer des profits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comment contacter un vendeur?</h3>
                <p className="text-gray-600">
                  Lorsque vous êtes intéressé par une annonce, cliquez sur le bouton "Contacter" sur la page de l'annonce. 
                  Vous pourrez ensuite envoyer un message au vendeur via notre système de messagerie interne.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Puis-je devenir partenaire?</h3>
                <p className="text-gray-600">
                  Absolument! Nous sommes toujours à la recherche de partenaires qui partagent notre vision d'un Madagascar plus durable. 
                  Contactez-nous via le formulaire ci-dessus ou à l'adresse partenariats@greentech-mada.com.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
