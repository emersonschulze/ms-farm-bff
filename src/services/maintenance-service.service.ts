import { httpGet } from '@/lib/http-client';
import type { MaintenanceServiceResponse } from '@/types/farm.types';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export class MaintenanceServiceService {
  async getAll(): Promise<MaintenanceServiceResponse[]> {
    return httpGet<MaintenanceServiceResponse[]>(`${BASE_URL}/api/v1/maintenance-services`);
  }
}
