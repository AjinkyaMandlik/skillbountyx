import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Bounty from '@/models/Bounty';
import Submission from '@/models/Submission';
import { authenticate } from '@/lib/auth';
import { releasePayment } from '@/lib/stellar';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await authenticate();
    
    const { submission_id } = await req.json();
    
    const bounty = await Bounty.findById(id);
    if (!bounty) return NextResponse.json({ message: 'Bounty not found' }, { status: 404 });

    if (bounty.creator_id.toString() !== user.id) {
      return NextResponse.json({ message: 'User not authorized' }, { status: 401 });
    }

    const submission = await Submission.findById(submission_id).populate('freelancer_id', 'wallet_address');
    if (!submission) return NextResponse.json({ message: 'Submission not found' }, { status: 404 });

    // Payout logic via Stellar
    const txHash = await releasePayment(submission.freelancer_id.wallet_address, bounty.reward_amount.toString());

    submission.status = 'approved';
    await submission.save();

    bounty.status = 'completed';
    await bounty.save();

    return NextResponse.json({ message: 'Work approved and payment released', txHash });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: err.message === 'No token, authorization denied' || err.message === 'Token is not valid' ? err.message : 'Server Error' }, { status: err.message.includes('token') ? 401 : 500 });
  }
}
