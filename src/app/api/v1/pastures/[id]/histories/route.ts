import { NextRequest, NextResponse } from 'next/server';
import { PastureService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new PastureService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  logger.info('[pastures/histories] GET request received', { pastureId: id });

  try {
    const items = await service.getHistories(id);
    return NextResponse.json(items);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[pastures/histories] GET failed', { status: error.status });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }
    logger.error('[pastures/histories] GET failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const body = await request.json() as { maintenanceDate: string; description: string; maintenanceServiceId: number | null };

  logger.info('[pastures/histories] POST request received', { pastureId: id });

  try {
    const created = await service.createHistory(id, body);
    logger.info('[pastures/histories] POST completed', { id: created.id });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[pastures/histories] POST failed', { status: error.status, url: error.url });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[pastures/histories] POST failed', { error: String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
