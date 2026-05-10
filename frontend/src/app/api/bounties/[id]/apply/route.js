import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Bounty from '@/models/Bounty';
import Submission from '@/models/Submission';
import { authenticate } from '@/lib/auth';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await authenticate();
    
    const { work_url, message } = await req.json();

    const bounty = await Bounty.findById(id);
    if (!bounty) return NextResponse.json({ message: 'Bounty not found' }, { status: 404 });

    const submission = new Submission({
      bounty_id: id,
      freelancer_id: user.id,
      work_url,
      message,
      status: 'submitted'
    });

    await submission.save();

    bounty.status = 'pending_approval';
    await bounty.save();

    return NextResponse.json(submission);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: err.message === 'No token, authorization denied' || err.message === 'Token is not valid' ? err.message : 'Server Error' }, { status: err.message.includes('token') ? 401 : 500 });
  }
}
