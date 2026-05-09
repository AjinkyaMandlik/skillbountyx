"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../context/WalletContext';
import api from '../../../lib/api';

export default function CreateBounty() {
  const { user } = useWallet();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward_amount: '',
    deadline: '',
    skills_required: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please connect wallet first');
    
    setLoading(true);
    try {
      // MVP: Simulated Escrow. In reality, we'd trigger a Freighter transaction here.
      // const tx = await signTransaction(...)
      const simulatedTxHash = 'simulated_escrow_tx_' + Date.now();

      await api.post('/bounties', {
        ...formData,
        reward_amount: Number(formData.reward_amount),
        skills_required: formData.skills_required.split(',').map(s => s.trim()),
        escrow_tx_hash: simulatedTxHash
      });
      
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating bounty');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-20">Please connect your wallet to create a bounty.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Post a New Task</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl border border-gray-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Task Title</label>
          <input 
            required
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="e.g. Build a landing page using React"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea 
            required
            rows={5}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="Describe the task in detail..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Reward Amount (XLM)</label>
            <input 
              required
              type="number" 
              min="1"
              value={formData.reward_amount}
              onChange={e => setFormData({...formData, reward_amount: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
            <input 
              required
              type="date" 
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">Skills Required (comma separated)</label>
          <input 
            required
            type="text" 
            value={formData.skills_required}
            onChange={e => setFormData({...formData, skills_required: e.target.value})}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            placeholder="React, Node.js, Design"
          />
        </div>

        <div className="bg-blue-900/20 p-4 rounded-lg mb-8 border border-blue-800/50">
          <p className="text-sm text-blue-200">
            <strong>Escrow Note:</strong> Upon creation, you will simulate depositing the XLM reward into the platform escrow. It will be securely held until you approve the submitted work.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-4 rounded-lg font-bold text-lg transition shadow-lg"
        >
          {loading ? 'Processing...' : 'Fund & Post Task'}
        </button>
      </form>
    </div>
  );
}
