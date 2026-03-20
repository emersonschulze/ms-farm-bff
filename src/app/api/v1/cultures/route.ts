import { NextRequest, NextResponse } from 'next/server';
import { CultureService } from '@/services/culture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateCultureRequest } from '@/types/farm.types';

const service = new CultureService();

export async function GET(): Promise<NextResponse> {
  logger.info('[cultures] GET list request received');

  try {
    const data = await service.getAll();
    logger.info('[cultures] GET list completed', { total: data.length });
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, '[cultures] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateCultureRequest;

  logger.info('[cultures] POST request received', { name: body.name });

  try {
    const created = await service.create(body);
    logger.info('[cultures] POST completed', { id: created.id });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleError(error, '[cultures] POST failed');
  }
}

function handleError(error: unknown, context: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, url: error.url });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error) });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
