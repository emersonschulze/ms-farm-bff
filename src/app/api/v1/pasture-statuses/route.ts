import { NextResponse } from 'next/server';
import { PastureStatusService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new PastureStatusService();

export async function GET(): Promise<NextResponse> {
  logger.info('[pasture-statuses] GET list request received');

  try {
    const data = await service.getAll();
    logger.info('[pasture-statuses] GET list completed', { total: data.length });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[pasture-statuses] GET list failed', { status: error.status, url: error.url });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[pasture-statuses] GET list failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
