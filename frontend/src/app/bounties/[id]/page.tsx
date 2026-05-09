"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '../../../context/WalletContext';
import api from '../../../lib/api';
import { Clock, DollarSign, User, ExternalLink } from 'lucide-react';

export default function BountyDetails({ params }: { params: { id: string } }) {
  const { user } = useWallet();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [workUrl, setWorkUrl] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchBounty = () => {
    api.get(`/bounties/${params.id}`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBounty();
  }, [params.id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/bounties/${params.id}/apply`, { work_url: workUrl, message });
      alert('Work submitted successfully!');
      fetchBounty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    if (!confirm('Are you sure you want to approve this work and release funds?')) return;
    try {
      const res = await api.post(`/bounties/${params.id}/approve`, { submission_id: submissionId });
      alert(`Work approved! Stellar Tx Hash: ${res.data.txHash}`);
      fetchBounty();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error approving work');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!data || !data.bounty) return <div className="text-center py-20 text-red-400">Bounty not found</div>;

  const { bounty, submissions } = data;
  const isCreator = user?.id === bounty.creator_id._id;
  const hasSubmitted = submissions.some((s: any) => s.freelancer_id._id === user?.id);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{bounty.title}</h1>
          <span className={`px-4 py-2 rounded-lg font-bold text-lg flex items-center
            ${bounty.status === 'open' ? 'bg-green-500/20 text-green-400' : 
              bounty.status === 'completed' ? 'bg-gray-700 text-gray-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            <DollarSign className="w-5 h-5 mr-1" />
            {bounty.reward_amount} XLM
          </span>
        </div>

        <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-400">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            Posted by: <span className="text-blue-400 ml-1">{bounty.creator_id.username}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Deadline: <span className="ml-1">{new Date(bounty.deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            Status: <span className="ml-1 capitalize text-white">{bounty.status.replace('_', ' ')}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Description</h3>
        <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">{bounty.description}</p>

        <h3 className="text-xl font-bold mb-4">Skills Required</h3>
        <div className="flex flex-wrap gap-2 mb-8">
          {bounty.skills_required.map((skill: string) => (
            <span key={skill} className="bg-gray-700 px-3 py-1 rounded text-sm text-gray-300">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Freelancer Application Section */}
      {!isCreator && bounty.status === 'open' && !hasSubmitted && user && (
        <div className="bg-gray-800 p-8 rounded-2xl border border-blue-500/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-2xl font-bold mb-6">Submit Your Work</h2>
          <form onSubmit={handleApply}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Work URL (GitHub, Figma, etc)</label>
              <input 
                required
                type="url" 
                value={workUrl}
                onChange={e => setWorkUrl(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="https://"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Message to Creator</label>
              <textarea 
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                placeholder="Briefly explain your solution..."
              />
            </div>
            <button 
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-bold transition"
            >
              {submitting ? 'Submitting...' : 'Submit Work'}
            </button>
          </form>
        </div>
      )}

      {/* Show submissions for Creator */}
      {isCreator && submissions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Submissions</h2>
          <div className="space-y-4">
            {submissions.map((sub: any) => (
              <div key={sub._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold">{sub.freelancer_id.username}</span>
                    <span className={`text-xs px-2 py-1 rounded ${sub.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {sub.status}
                    </span>
                  </div>
                  <a href={sub.work_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center text-sm mb-2">
                    View Work <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  <p className="text-gray-400 text-sm">"{sub.message}"</p>
                </div>
                
                {bounty.status !== 'completed' && sub.status === 'submitted' && (
                  <button 
                    onClick={() => handleApprove(sub._id)}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition whitespace-nowrap"
                  >
                    Approve & Pay
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hasSubmitted && !isCreator && (
        <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl text-center">
          <h3 className="text-green-400 font-bold mb-2">Work Submitted</h3>
          <p className="text-sm text-green-200">Your work is currently under review by the creator. You will receive the XLM reward upon approval.</p>
        </div>
      )}
    </div>
  );
}
