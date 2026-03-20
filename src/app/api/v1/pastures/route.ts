import { NextRequest, NextResponse } from 'next/server';
import { PastureService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreatePastureRequest } from '@/types/farm.types';

const service = new PastureService();

export async function GET(): Promise<NextResponse> {
  logger.info('[pastures] GET list request received');

  try {
    const data = await service.getAll();
    logger.info('[pastures] GET list completed', { total: data.length });
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, '[pastures] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreatePastureRequest;

  logger.info('[pastures] POST request received', { pastureNumber: body.pastureNumber });

  try {
    const created = await service.create(body);
    logger.info('[pastures] POST completed', { id: created.id });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleError(error, '[pastures] POST failed');
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
