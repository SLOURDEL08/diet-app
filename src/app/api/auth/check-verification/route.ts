// app/api/auth/check-verification/route.ts
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { User } from '@/models/User';

export async function GET(req: Request) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ verified: false }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    const user = await User.findById(decoded.userId);

    return NextResponse.json({ verified: user?.emailVerified || false });
  } catch (error) {
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}