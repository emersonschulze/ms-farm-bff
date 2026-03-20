import { NextRequest, NextResponse } from 'next/server';
import { PastureService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdatePastureRequest } from '@/types/farm.types';

const service = new PastureService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[pastures] GET by id request received', { id });

  try {
    const data = await service.getById(id);
    logger.info('[pastures] GET by id completed', { id });
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, '[pastures] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdatePastureRequest;

  logger.info('[pastures] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    logger.info('[pastures] PUT completed', { id });
    return NextResponse.json(updated);
  } catch (error) {
    return handleError(error, '[pastures] PUT failed', id);
  }
}

function handleError(error: unknown, context: string, id?: string): NextResponse {
  if (error instanceof HttpError) {
    logger.warn(context, { status: error.status, id });
    return NextResponse.json({ error: error.body }, { status: error.status });
  }

  logger.error(context, { error: String(error), id });
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
