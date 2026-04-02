import { NextResponse } from 'next/server';
import { MaintenanceServiceService } from '@/services/maintenance-service.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new MaintenanceServiceService();

export async function GET(): Promise<NextResponse> {
  logger.info('[maintenance-services] GET list request received');

  try {
    const data = await service.getAll();
    logger.info('[maintenance-services] GET list completed', { total: data.length });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[maintenance-services] GET failed', { status: error.status, url: error.url });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[maintenance-services] GET failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
