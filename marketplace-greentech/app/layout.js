import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ApolloWrapper } from "./components/AppoloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GreenTech Marketplace - Réutilisation de Matériaux",
  description: "Plateforme pour donner, récupérer ou vendre à prix réduit des matériaux de construction ou d'artisanat à Madagascar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ApolloWrapper>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
