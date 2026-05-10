import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { username, email, password, wallet_address, role } = await req.json();

    let user = await User.findOne({ email });
    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password_hash,
      wallet_address,
      role
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    return NextResponse.json({ token, user: { id: user.id, username, role, wallet_address } });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
