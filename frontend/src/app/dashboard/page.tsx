"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading: walletLoading } = useWallet();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      api.get('/users/me')
        .then(res => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, walletLoading, router]);

  if (walletLoading || loading) return <div className="p-20 text-center">Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 mb-1">Role</h3>
          <p className="text-2xl font-bold capitalize">{user.role}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 mb-1">Wallet</h3>
          <p className="text-lg font-mono truncate" title={user.wallet_address}>
            {user.wallet_address}
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-gray-400 mb-1">Reputation</h3>
          <p className="text-2xl font-bold text-blue-400">{data?.user?.reputation_score || 0}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Posted Bounties</h2>
      {data?.createdBounties?.length > 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="p-4 font-medium text-gray-400">Title</th>
                <th className="p-4 font-medium text-gray-400">Reward</th>
                <th className="p-4 font-medium text-gray-400">Status</th>
                <th className="p-4 font-medium text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.createdBounties.map((bounty: any) => (
                <tr key={bounty._id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="p-4 font-medium">{bounty.title}</td>
                  <td className="p-4 text-blue-400">{bounty.reward_amount} XLM</td>
                  <td className="p-4 capitalize">{bounty.status.replace('_', ' ')}</td>
                  <td className="p-4 text-right">
                    <Link href={`/bounties/${bounty._id}`} className="text-blue-400 hover:underline text-sm">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 bg-gray-800/50 p-8 rounded-xl text-center border border-gray-700">
          You haven't posted any bounties yet.
          <div className="mt-4">
            <Link href="/bounties/create">
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition">
                Post a Task
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
