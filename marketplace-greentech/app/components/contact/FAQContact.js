/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

export default function FAQContact() {
  const [openFAQ, setOpenFAQ] = useState(0)

  const faqs = [
    {
      question: "Comment puis-je publier une annonce?",
      answer: "Pour publier une annonce, vous devez d'abord créer un compte. Ensuite, accédez à votre tableau de bord et cliquez sur \"Déposer une annonce\". Remplissez le formulaire avec les détails de votre matériau et téléchargez des photos."
    },
    {
      question: "Est-ce que l'utilisation de la plateforme est gratuite?",
      answer: "Oui, l'inscription et la publication d'annonces sont entièrement gratuites. Notre objectif est de faciliter la réutilisation des matériaux, pas de générer des profits."
    },
    {
      question: "Comment contacter un vendeur?",
      answer: "Lorsque vous êtes intéressé par une annonce, cliquez sur le bouton \"Contacter\" sur la page de l'annonce. Vous pourrez ensuite envoyer un message au vendeur via notre système de messagerie interne."
    },
    {
      question: "Puis-je devenir partenaire?",
      answer: "Absolument! Nous sommes toujours à la recherche de partenaires qui partagent notre vision d'un Madagascar plus durable. Contactez-nous via le formulaire ci-dessus ou à l'adresse partenariats@greentech-mada.com."
    },
    {
      question: "Quels types de matériaux puis-je proposer?",
      answer: "Vous pouvez proposer tous types de matériaux de construction et d'artisanat : bois, métal, pierre, carrelage, équipements, outils, etc. L'important est qu'ils soient encore utilisables et en bon état."
    },
    {
      question: "Comment garantir la qualité des matériaux?",
      answer: "Nous encourageons les vendeurs à fournir des descriptions détaillées et des photos de qualité. Les acheteurs peuvent également laisser des avis après transaction pour maintenir la confiance dans la communauté."
    }
  ]

  return (
    <div>
      {/* FAQ Section - Modern Design */}
      <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center px-3 py-1.5 lg:px-4 lg:py-2 bg-green-100 text-green-800 rounded-full text-xs lg:text-sm font-medium mb-4 lg:mb-6">
              <HelpCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
              Questions Fréquentes
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
              Besoin
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> d'aide?</span>
            </h2>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Retrouvez les réponses aux questions les plus courantes sur notre plateforme de réutilisation de matériaux.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 lg:space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden">

                    {/* Question */}
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
                      className="w-full p-4 lg:p-6 text-left flex items-center justify-between hover:bg-green-50/50 transition-colors duration-300"
                    >
                      <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600 transform transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400 transform transition-transform duration-300" />
                        )}
                      </div>
                    </button>

                    {/* Answer */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-8 lg:mt-12">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 text-gray-600">
              <span className="text-sm lg:text-base">Vous ne trouvez pas votre réponse ?</span>
              <a href="#contact-form" className="text-sm lg:text-base text-green-600 font-medium hover:text-green-700 transition-colors duration-300">
                Contactez-nous directement
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
