import { NextRequest, NextResponse } from 'next/server';
import { AddressService } from '@/services/address.service';
import { adaptAddress } from '@/adapters/address.adapter';
import { logger } from '@/lib/logger';
import { HttpError } from '@/lib/http-client';

const service = new AddressService();

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ postalCode: string }> },
): Promise<NextResponse> {
  const { postalCode } = await params;

  logger.info('[address] GET request received', { postalCode });

  try {
    const data    = await service.getByPostalCode(postalCode);
    const adapted = adaptAddress(data);

    logger.info('[address] GET completed', { postalCode });

    return NextResponse.json(adapted);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      logger.warn('[address] Postal code not found', { postalCode });
      return NextResponse.json({ error: 'Postal code not found' }, { status: 404 });
    }

    logger.error('[address] GET failed', { error: String(error), postalCode });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
