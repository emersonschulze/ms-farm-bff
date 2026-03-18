import { NextRequest, NextResponse } from 'next/server';
import { FarmService } from '@/services/farm.service';
import { adaptFarm } from '@/adapters/farm.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new FarmService();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[farms] PATCH inactivate request received', { id });

  try {
    const data    = await service.inactivate(id);
    const adapted = adaptFarm(data);

    logger.info('[farms] PATCH inactivate completed', { id });

    return NextResponse.json(adapted);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[farms] PATCH inactivate failed', { status: error.status, id });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }
    logger.error('[farms] PATCH inactivate failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
