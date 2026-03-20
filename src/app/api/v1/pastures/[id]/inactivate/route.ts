import { NextRequest, NextResponse } from 'next/server';
import { PastureService } from '@/services/pasture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new PastureService();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[pastures] PATCH inactivate request received', { id });

  try {
    const updated = await service.inactivate(id);
    logger.info('[pastures] PATCH inactivate completed', { id });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[pastures] PATCH inactivate failed', { status: error.status, id });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[pastures] PATCH inactivate failed', { error: String(error), id });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
