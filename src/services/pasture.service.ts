import { httpGet, httpPost, httpPut, httpPatch } from '@/lib/http-client';
import type {
  PastureResponse,
  PastureStatusResponse,
  CreatePastureRequest,
  UpdatePastureRequest,
  PastureSummaryResponse,
  PastureHistoryResponse,
  CreatePastureHistoryRequest,
} from '@/types/farm.types';

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

  async getSummary(farmId?: string): Promise<PastureSummaryResponse> {
    const url = farmId
      ? `${BASE_URL}/api/v1/pastures/summary?farmId=${farmId}`
      : `${BASE_URL}/api/v1/pastures/summary`;
    return httpGet<PastureSummaryResponse>(url);
  }

  async getHistories(id: string): Promise<PastureHistoryResponse[]> {
    return httpGet<PastureHistoryResponse[]>(`${BASE_URL}/api/v1/pastures/${id}/histories`);
  }

  async createHistory(id: string, body: Omit<CreatePastureHistoryRequest, 'pastureId'>): Promise<PastureHistoryResponse> {
    return httpPost<PastureHistoryResponse>(`${BASE_URL}/api/v1/pastures/${id}/histories`, {
      ...body,
      pastureId: Number(id),
    });
  }
}

export class PastureStatusService {
  async getAll(): Promise<PastureStatusResponse[]> {
    return httpGet<PastureStatusResponse[]>(`${BASE_URL}/api/v1/pasture-statuses`);
  }
}
