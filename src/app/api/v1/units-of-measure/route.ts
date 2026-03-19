import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { HttpError, httpGet } from '@/lib/http-client';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export async function GET(): Promise<NextResponse> {
  logger.info('[units-of-measure] GET list request received');

  try {
    const data = await httpGet<unknown[]>(`${BASE_URL}/api/v1/units-of-measure`);
    logger.info('[units-of-measure] GET list completed', { total: data.length });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[units-of-measure] GET list failed', { status: error.status });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }
    logger.error('[units-of-measure] GET list failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
