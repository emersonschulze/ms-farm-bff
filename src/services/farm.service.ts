import { httpDelete, httpGet, httpPost, httpPut } from '@/lib/http-client';
import type { CreateFarmRequest, FarmModel, UpdateFarmRequest } from '@/types/farm.types';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export class FarmService {
  async getAll(): Promise<FarmModel[]> {
    return httpGet<FarmModel[]>(`${BASE_URL}/api/v1/farms`);
  }

  async getById(id: string): Promise<FarmModel> {
    return httpGet<FarmModel>(`${BASE_URL}/api/v1/farms/${id}`);
  }

  async create(body: CreateFarmRequest): Promise<FarmModel> {
    return httpPost<FarmModel>(`${BASE_URL}/api/v1/farms`, body);
  }

  async update(id: string, body: UpdateFarmRequest): Promise<FarmModel> {
    return httpPut<FarmModel>(`${BASE_URL}/api/v1/farms/${id}`, body);
  }

  async delete(id: string): Promise<void> {
    return httpDelete(`${BASE_URL}/api/v1/farms/${id}`);
  }
}
