import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">GreenTech Marketplace</h3>
            <p className="text-gray-400 mb-4">
              Plateforme pour donner, récupérer ou vendre à prix réduit des matériaux 
              de construction ou d'artisanat à Madagascar.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/listings" className="text-gray-400 hover:text-green-400">
                  Annonces
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-green-400">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-400">
                  À propos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span>Fianarantsoa, Madagascar</span>
              </li>
              <li className="text-gray-400">
                <span>contact@greentech-mada.com</span>
              </li>
              <li className="text-gray-400">
                <span>+261 34 00 000 00</span>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.075 10.075 0 01-3.127 1.195 4.95 4.95 0 00-8.418 4.512A14.1 14.1 0 011.64 3.161a4.951 4.951 0 001.525 6.575 4.94 4.94 0 01-2.23-.616v.06a4.95 4.95 0 003.955 4.85 4.903 4.903 0 01-2.222.084 4.95 4.95 0 004.6 3.435 9.905 9.905 0 01-6.127 2.118c-.4 0-.795-.023-1.187-.07a14.03 14.03 0 007.608 2.23c9.13 0 14.12-7.57 14.12-14.12 0-.215-.005-.43-.015-.645a10.066 10.066 0 002.457-2.565z"></path>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-2 rounded-full hover:opacity-90"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.053 1.805.249 2.227.419.4.155.783.359 1.112.688.33.328.535.711.69 1.111.17.421.365 1.057.418 2.227.058 1.266.07 1.646.07 4.85 0 3.204-.012 3.584-.07 4.85-.053 1.17-.249 1.805-.418 2.227-.155.4-.36.783-.69 1.112-.328.33-.711.535-1.112.69-.421.17-1.057.365-2.227.418-1.266.058-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-1.17-.053-1.805-.249-2.227-.419-.4-.155-.783-.359-1.112-.688-.33-.328-.535-.711-.69-1.111-.17-.421-.365-1.057-.418-2.227-.058-1.266-.07-1.646-.07-4.85 0-3.204.012-3.584.07-4.85.053-1.17.249-1.805.418-2.227.155-.4.36-.783.69-1.112.328-.33.711-.535 1.112-.69.421-.17 1.057-.365 2.227-.418 1.266-.058 1.646-.07 4.85-.07zm0 2.163c-3.15 0-3.51.013-4.744.069-1.144.052-1.765.243-2.176.4-.547.213-.937.465-1.349.876-.412.412-.664.802-.876 1.35-.158.41-.35 1.031-.401 2.175-.056 1.234-.069 1.595-.069 4.744 0 3.15.013 3.51.069 4.744.052 1.144.243 1.765.4 2.176.213.547.465.937.876 1.349.412.412.802.664 1.35.876.41.158 1.031.35 2.175.401 1.234.056 1.595.069 4.744.069 3.15 0 3.51-.013 4.744-.069 1.144-.052 1.765-.243 2.176-.4.547-.213.937-.465 1.349-.876.412-.412.664-.802.876-1.35.158-.41.35-1.031.401-2.175.056-1.234.069-1.595.069-4.744 0-3.15-.013-3.51-.069-4.744-.052-1.144-.243-1.765-.4-2.176-.213-.547-.465-.937-.876-1.349-.412-.412-.802-.664-1.35-.876-.41-.158-1.031-.35-2.175-.401-1.234-.056-1.595-.069-4.744-.069z"></path>
                  <path d="M12 6.162a5.838 5.838 0 100 11.676 5.838 5.838 0 000-11.676zm0 9.622a3.784 3.784 0 110-7.568 3.784 3.784 0 010 7.568zm7.415-9.853a1.364 1.364 0 11-2.728 0 1.364 1.364 0 012.728 0z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()} GreenTech Marketplace. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
} 