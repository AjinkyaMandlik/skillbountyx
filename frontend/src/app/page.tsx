"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Decentralized <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Skill Bounties</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Complete micro-tasks, freelance jobs, and coding bounties. Get paid instantly and securely on the Stellar network.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/bounties">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] w-full sm:w-auto">
              Browse Bounties
            </button>
          </Link>
          <Link href="/bounties/create">
            <button className="px-8 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-bold text-lg transition w-full sm:w-auto">
              Post a Task
            </button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full"
      >
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400 text-2xl">
            1
          </div>
          <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
          <p className="text-gray-400">Use Freighter wallet to instantly create an account securely.</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400 text-2xl">
            2
          </div>
          <h3 className="text-xl font-bold mb-2">Complete Work</h3>
          <p className="text-gray-400">Find bounties matching your skills and submit your work.</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400 text-2xl">
            3
          </div>
          <h3 className="text-xl font-bold mb-2">Get Paid</h3>
          <p className="text-gray-400">Receive instant XLM testnet payments when work is approved.</p>
        </div>
      </motion.div>
    </div>
  );
}
