import { NextRequest, NextResponse } from 'next/server';
import { CultureService } from '@/services/culture.service';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new CultureService();

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  logger.info('[cultures] PATCH inactivate request received', { id });

  try {
    const updated = await service.inactivate(id);
    logger.info('[cultures] PATCH inactivate completed', { id });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof HttpError) {
      logger.warn('[cultures] PATCH inactivate failed', { status: error.status, id });
      return NextResponse.json({ error: error.body }, { status: error.status });
    }

    logger.error('[cultures] PATCH inactivate failed', { error: String(error), id });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
