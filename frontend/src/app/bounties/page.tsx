"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Search, Clock, DollarSign } from 'lucide-react';

export default function Marketplace() {
  const [bounties, setBounties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bounties')
      .then(res => setBounties(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Find bounties and earn XLM</p>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bounties.map((bounty, idx) => (
            <motion.div 
              key={bounty._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase
                  ${bounty.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {bounty.status}
                </span>
                <span className="flex items-center text-blue-400 font-bold">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {bounty.reward_amount} XLM
                </span>
              </div>
              
              <h2 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition">{bounty.title}</h2>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{bounty.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {bounty.skills_required?.slice(0, 3).map((skill: string) => (
                  <span key={skill} className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                    {skill}
                  </span>
                ))}
                {bounty.skills_required?.length > 3 && (
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">+{bounty.skills_required.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-auto">
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(bounty.deadline).toLocaleDateString()}
                </div>
                <Link href={`/bounties/${bounty._id}`}>
                  <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                    View Details &rarr;
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && bounties.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          No open bounties found. Be the first to post one!
        </div>
      )}
    </div>
  );
}
