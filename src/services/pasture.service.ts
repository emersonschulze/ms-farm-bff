import { httpGet, httpPost, httpPut, httpPatch } from '@/lib/http-client';
import type { PastureResponse, PastureStatusResponse, CreatePastureRequest, UpdatePastureRequest } from '@/types/farm.types';

const BASE_URL = process.env.FARM_PROCESS_URL!;

export class PastureService {
  async getAll(): Promise<PastureResponse[]> {
    return httpGet<PastureResponse[]>(`${BASE_URL}/api/v1/pastures`);
  }

  async getById(id: string): Promise<PastureResponse> {
    return httpGet<PastureResponse>(`${BASE_URL}/api/v1/pastures/${id}`);
  }

  async create(body: CreatePastureRequest): Promise<PastureResponse> {
    return httpPost<PastureResponse>(`${BASE_URL}/api/v1/pastures`, body);
  }

  async update(id: string, body: UpdatePastureRequest): Promise<PastureResponse> {
    return httpPut<PastureResponse>(`${BASE_URL}/api/v1/pastures/${id}`, body);
  }

  async inactivate(id: string): Promise<PastureResponse> {
    return httpPatch<PastureResponse>(`${BASE_URL}/api/v1/pastures/${id}/inactivate`);
  }
}

export class PastureStatusService {
  async getAll(): Promise<PastureStatusResponse[]> {
    return httpGet<PastureStatusResponse[]>(`${BASE_URL}/api/v1/pasture-statuses`);
  }
}
