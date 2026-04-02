import { NextRequest, NextResponse } from 'next/server';
import { PastureService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new PastureService();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const farmId = request.nextUrl.searchParams.get('farmId') ?? undefined;

  logger.info('[pastures/summary] GET request received', { farmId });

  try {
    const data = await service.getSummary(farmId);
    logger.info('[pastures/summary] GET completed', { total: data.totalPastures });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[pastures/summary] GET failed', { status: error.status, url: error.url });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[pastures/summary] GET failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
