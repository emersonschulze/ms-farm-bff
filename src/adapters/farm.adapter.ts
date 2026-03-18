import type { FarmModel } from '@/types/farm.types';

// The BFF passes through the farm shape as-is — no field renames needed.
// The adapter layer exists to isolate the frontend from backend contract changes.

export function adaptFarm(data: FarmModel): FarmModel {
  return data;
}

export function adaptFarmList(data: FarmModel[]): FarmModel[] {
  return data.map(adaptFarm);
}
