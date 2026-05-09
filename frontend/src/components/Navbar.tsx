"use client";

import Link from 'next/link';
import { useWallet } from '../context/WalletContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, publicKey, connect, disconnect } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('freelancer');

  const handleConnect = async () => {
    await connect(username, role);
    setShowModal(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          SkillBountyX
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/bounties" className="hover:text-blue-400 transition">Marketplace</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
              <Link href="/bounties/create" className="hover:text-blue-400 transition">Create Bounty</Link>
              <button 
                onClick={disconnect}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition"
              >
                {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Join SkillBountyX</h2>
            <p className="text-gray-400 mb-6">Create a profile to get started.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="cool_dev_99"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">I am a...</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="freelancer">Freelancer (Completing tasks)</option>
                <option value="creator">Creator (Posting tasks)</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-gray-400 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleConnect}
                disabled={!username}
                className="bg-blue-600 disabled:bg-gray-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
              >
                Connect Freighter
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
