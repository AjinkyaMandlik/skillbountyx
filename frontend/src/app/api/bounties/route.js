import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Bounty from '@/models/Bounty';
import { authenticate } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const bounties = await Bounty.find().populate('creator_id', 'username wallet_address').sort({ createdAt: -1 });
    return NextResponse.json(bounties);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await authenticate();
    
    const { title, description, reward_amount, deadline, skills_required, escrow_tx_hash } = await req.json();

    const newBounty = new Bounty({
      title,
      description,
      reward_amount,
      deadline,
      skills_required,
      creator_id: user.id,
      status: 'open',
      escrow_tx_hash
    });

    const bounty = await newBounty.save();
    return NextResponse.json(bounty);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ 
      message: err.message === 'No token, authorization denied' || err.message === 'Token is not valid' ? err.message : 'Server Error',
      error: err.message 
    }, { status: err.message.includes('token') ? 401 : 500 });
  }
}
