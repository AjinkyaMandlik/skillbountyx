import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Bounty from '@/models/Bounty';
import { authenticate } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const currentUser = await authenticate();

    const user = await User.findById(currentUser.id).select('-password_hash');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    // Get user's active/completed tasks
    const createdBounties = await Bounty.find({ creator_id: currentUser.id });
    
    return NextResponse.json({ user, createdBounties });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: err.message === 'No token, authorization denied' || err.message === 'Token is not valid' ? err.message : 'Server Error' }, { status: err.message.includes('token') ? 401 : 500 });
  }
}
