import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';

export async function authenticate() {
  const headersList = await headers();
  const token = headersList.get('x-auth-token');

  if (!token) {
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.user;
  } catch (err) {
    throw new Error('Token is not valid');
  }
}
