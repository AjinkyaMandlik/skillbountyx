import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const user = await User.findById(id).select('-password_hash -email');
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
    
    return NextResponse.json(user);
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
