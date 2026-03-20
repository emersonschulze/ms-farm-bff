import { httpGet, httpPost, httpPut, httpPatch } from '@/lib/http-client';
import type { CultureModel, CreateCultureRequest, UpdateCultureRequest } from '@/types/farm.types';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export class CultureService {
  async getAll(): Promise<CultureModel[]> {
    return httpGet<CultureModel[]>(`${BASE_URL}/api/v1/cultures`);
  }

  async getById(id: string): Promise<CultureModel> {
    return httpGet<CultureModel>(`${BASE_URL}/api/v1/cultures/${id}`);
  }

  async create(body: CreateCultureRequest): Promise<CultureModel> {
    return httpPost<CultureModel>(`${BASE_URL}/api/v1/cultures`, body);
  }

  async update(id: string, body: UpdateCultureRequest): Promise<CultureModel> {
    return httpPut<CultureModel>(`${BASE_URL}/api/v1/cultures/${id}`, body);
  }

  async inactivate(id: string): Promise<CultureModel> {
    return httpPatch<CultureModel>(`${BASE_URL}/api/v1/cultures/${id}/inactivate`);
  }
}
