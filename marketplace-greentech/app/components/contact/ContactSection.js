import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
            });
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
            console.error('Form submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {/* Contact Section - Modern Design */}
            <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-green-50 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 right-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
                    <div className="absolute bottom-10 left-10 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
                </div>

                <div className="relative container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* Contact Form */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center text-center py-8">
                                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl mb-6">
                                            <Send size={32} />
                                        </div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">Message envoyé!</h2>
                                        <p className="text-sm lg:text-base text-gray-600 mb-6">
                                            Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            Envoyer un autre message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-6 lg:mb-8">
                                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                                            <p className="text-sm lg:text-base text-gray-600">Nous vous répondrons rapidement</p>
                                        </div>

                                        {error && (
                                            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
                                                {error}
                                            </div>
                                        )}

                                        <div className="space-y-4 lg:space-y-6">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Votre nom
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                                    placeholder="Nom complet"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Adresse e-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                                    placeholder="votre@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Sujet
                                                </label>
                                                <select
                                                    id="subject"
                                                    name="subject"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Sélectionnez un sujet</option>
                                                    <option value="question">Question générale</option>
                                                    <option value="partnership">Proposition de partenariat</option>
                                                    <option value="bug">Signaler un problème technique</option>
                                                    <option value="suggestion">Suggestion d&apos;amélioration</option>
                                                    <option value="other">Autre</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Message
                                                </label>
                                                <textarea
                                                    id="message"
                                                    name="message"
                                                    rows={6}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 resize-none"
                                                    placeholder="Votre message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    onClick={handleSubmit}
                                                    className="w-full inline-flex items-center justify-center px-6 py-3 lg:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                            Envoi en cours...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5 mr-2" />
                                                            Envoyer le message
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6 lg:space-y-8">
                            <div className="mb-6 lg:mb-8">
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Nos coordonnées</h2>
                                <p className="text-sm lg:text-base text-gray-600">Plusieurs moyens de nous joindre</p>
                            </div>

                            <div className="space-y-4 lg:space-y-6">
                                <div className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 flex items-start">
                                        <div className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Adresse</h3>
                                            <p className="text-sm lg:text-base text-gray-600 mt-1">
                                                Antarandolo<br />
                                                Fianarantsoa 301<br />
                                                Madagascar
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 flex items-start">
                                        <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl">
                                            <Phone size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Téléphone</h3>
                                            <p className="text-sm lg:text-base text-gray-600 mt-1">
                                                +261 34 00 000 00<br />
                                                +261 32 00 000 00
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 flex items-start">
                                        <div className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-xl">
                                            <Mail size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-base lg:text-lg font-semibold text-gray-900">E-mail</h3>
                                            <p className="text-sm lg:text-base text-gray-600 mt-1">
                                                contact@greentech-mada.com<br />
                                                support@greentech-mada.com
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                    <div className="relative bg-white/80 backdrop-blur-sm p-4 lg:p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 flex items-start">
                                        <div className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl">
                                            <Clock size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-base lg:text-lg font-semibold text-gray-900">Heures d&apos;ouverture</h3>
                                            <p className="text-sm lg:text-base text-gray-600 mt-1">
                                                Lundi - Vendredi: 8h00 - 17h00<br />
                                                Samedi: 9h00 - 12h00<br />
                                                Dimanche: Fermé
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-6 lg:mt-8">
                                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Suivez-nous</h3>
                                <div className="flex space-x-3 lg:space-x-4">
                                    <a
                                        href="https://facebook.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="sr-only">Facebook</span>
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-400 text-white p-3 rounded-xl hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="sr-only">Twitter</span>
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.075 10.075 0 01-3.127 1.195 4.95 4.95 0 00-8.418 4.512A14.1 14.1 0 011.64 3.161a4.951 4.951 0 001.525 6.575 4.94 4.94 0 01-2.23-.616v.06a4.95 4.95 0 003.955 4.85 4.903 4.903 0 01-2.222.084 4.95 4.95 0 004.6 3.435 9.905 9.905 0 01-6.127 2.118c-.4 0-.795-.023-1.187-.07a14.03 14.03 0 007.608 2.23c9.13 0 14.12-7.57 14.12-14.12 0-.215-.005-.43-.015-.645a10.066 10.066 0 002.457-2.565z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-xl hover:opacity-90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="sr-only">Instagram</span>
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.053 1.805.249 2.227.419.4.155.783.359 1.112.688.33.328.535.711.69 1.111.17.421.365 1.057.418 2.227.058 1.266.07 1.646.07 4.85 0 3.204-.012 3.584-.07 4.85-.053 1.17-.249 1.805-.418 2.227-.155.4-.36.783-.69 1.112-.328.33-.711.535-1.112.69-.421.17-1.057.365-2.227.418-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-1.17-.053-1.805-.249-2.227-.419-.4-.155-.783-.359-1.112-.688-.33-.328-.535-.711-.69-1.111-.17-.421-.365-1.057-.418-2.227-.058-1.266-.07-1.646-.07-4.85 0-3.204.012-3.584.07-4.85.053-1.17.249-1.805.418-2.227.155-.4.36-.783.69-1.112.328-.33.711-.535 1.112-.69.421-.17 1.057-.365 2.227-.418 1.266-.058 1.646-.07 4.85-.07zm0 2.163c-3.15 0-3.51.013-4.744.069-1.144.052-1.765.243-2.176.4-.547.213-.937.465-1.349.876-.412.412-.664.802-.876 1.35-.158.41-.35 1.031-.401 2.175-.056 1.234-.069 1.595-.069 4.744 0 3.15.013 3.51.069 4.744.052 1.144.243 1.765.4 2.176.213.547.465.937.876 1.349.412.412.802.664 1.35.876.41.158 1.031.35 2.175.401 1.234.056 1.595.069 4.744.069 3.15 0 3.51-.013 4.744-.069 1.144-.052 1.765-.243 2.176-.4.547-.213.937-.465 1.349-.876.412-.412.664-.802.876-1.35.158-.41.35-1.031.401-2.175.056-1.234.069-1.595.069-4.744 0-3.15-.013-3.51-.069-4.744-.052-1.144-.243-1.765-.4-2.176-.213-.547-.465-.937-.876-1.349-.412-.412-.802-.664-1.35-.876-.41-.158-1.031-.35-2.175-.401-1.234-.056-1.595-.069-4.744-.069z"></path>
                                            <path d="M12 6.162a5.838 5.838 0 100 11.676 5.838 5.838 0 000-11.676zm0 9.622a3.784 3.784 0 110-7.568 3.784 3.784 0 010 7.568zm7.415-9.853a1.364 1.364 0 11-2.728 0 1.364 1.364 0 012.728 0z"></path>
                                        </svg>
                                    </a>
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-blue-700 text-white p-3 rounded-xl hover:bg-blue-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}