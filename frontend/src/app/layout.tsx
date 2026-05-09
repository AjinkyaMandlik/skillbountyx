import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '../context/WalletContext';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillBountyX',
  description: 'Decentralized Skill Bounty Marketplace on Stellar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        <WalletProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
