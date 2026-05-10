import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Bounty from '@/models/Bounty';
import Submission from '@/models/Submission';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const bounty = await Bounty.findById(id).populate('creator_id', 'username wallet_address');
    if (!bounty) {
      return NextResponse.json({ message: 'Bounty not found' }, { status: 404 });
    }
    const submissions = await Submission.find({ bounty_id: id }).populate('freelancer_id', 'username wallet_address');
    
    return NextResponse.json({ bounty, submissions });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
