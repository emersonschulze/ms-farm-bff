import { httpGet } from '@/lib/http-client';
import type { AddressModel } from '@/types/address.types';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export class AddressService {
  async getByPostalCode(postalCode: string): Promise<AddressModel> {
    return httpGet<AddressModel>(`${BASE_URL}/api/v1/address/${postalCode}`);
  }
}
