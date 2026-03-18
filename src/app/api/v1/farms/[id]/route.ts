import { NextRequest, NextResponse } from 'next/server';
import { FarmService } from '@/services/farm.service';
import { adaptFarm } from '@/adapters/farm.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { UpdateFarmRequest } from '@/types/farm.types';

const service = new FarmService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[farms] GET by id request received', { id });

  try {
    const data    = await service.getById(id);
    const adapted = adaptFarm(data);

    logger.info('[farms] GET by id completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[farms] GET by id failed', id);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body   = (await request.json()) as UpdateFarmRequest;

  logger.info('[farms] PUT request received', { id });

  try {
    const updated = await service.update(id, body);
    const adapted = adaptFarm(updated);

    logger.info('[farms] PUT completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[farms] PUT failed', id);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[farms] DELETE request received', { id });

  try {
    await service.delete(id);

    logger.info('[farms] DELETE completed', { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error, '[farms] DELETE failed', id);
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
