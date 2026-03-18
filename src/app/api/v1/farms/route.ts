import { NextRequest, NextResponse } from 'next/server';
import { FarmService } from '@/services/farm.service';
import { adaptFarmList, adaptFarm } from '@/adapters/farm.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';
import type { CreateFarmRequest } from '@/types/farm.types';

const service = new FarmService();

export async function GET(): Promise<NextResponse> {
  logger.info('[farms] GET list request received');

  try {
    const data    = await service.getAll();
    const adapted = adaptFarmList(data);

    logger.info('[farms] GET list completed', { total: adapted.length });

    return NextResponse.json(adapted);
  } catch (error) {
    return handleError(error, '[farms] GET list failed');
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as CreateFarmRequest;

  logger.info('[farms] POST request received', { description: body.description });

  try {
    const created = await service.create(body);
    const adapted = adaptFarm(created);

    logger.info('[farms] POST completed', { id: adapted.id });

    return NextResponse.json(adapted, { status: 201 });
  } catch (error) {
    return handleError(error, '[farms] POST failed');
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
