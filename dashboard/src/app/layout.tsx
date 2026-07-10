import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Scanline from '@/components/Scanline';

export const metadata: Metadata = {
  title: 'ProVeil — ZK Compliance on Stellar',
  description: 'Privacy-preserving KYC compliance using zero-knowledge proofs on Stellar blockchain',
  keywords: ['ZK proofs', 'Stellar', 'compliance', 'privacy', 'Groth16', 'Soroban'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Scanline />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
