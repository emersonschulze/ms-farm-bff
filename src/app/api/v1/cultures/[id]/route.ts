import { NextRequest, NextResponse } from 'next/server';
import { CultureService } from '@/services/culture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateCultureRequest } from '@/types/farm.types';

const service = new CultureService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[cultures] GET by id request received', { id });

  try {
    const data = await service.getById(id);
    logger.info('[cultures] GET by id completed', { id });
    return NextResponse.json(data);
  } catch (error) {
    return handleError(error, '[cultures] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateCultureRequest;

  logger.info('[cultures] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    logger.info('[cultures] PUT completed', { id });
    return NextResponse.json(updated);
  } catch (error) {
    return handleError(error, '[cultures] PUT failed', id);
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
