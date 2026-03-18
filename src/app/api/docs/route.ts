import { NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(openApiSpec);
}
