import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status:    'healthy',
      service:   'ms-farm-bff',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
