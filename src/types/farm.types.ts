// ── Culture ───────────────────────────────────────────────────────────────────

export interface CultureModel {
  id:             number;
  name:           string;
  commercialName: string;
  cycle:          string | null;
  harvest:        string | null;
  isActive:       boolean;
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateCultureRequest {
  name:           string;
  commercialName: string;
  cycle:          string | null;
  harvest:        string | null;
}

export interface UpdateCultureRequest {
  name?:           string;
  commercialName?: string;
  cycle?:          string | null;
  harvest?:        string | null;
}

// ── Pasture ───────────────────────────────────────────────────────────────────

export interface PastureStatusResponse {
  id:   number;
  name: string;
}

export interface PastureResponse {
  id:                  number;
  pastureNumber:       string;
  area:                number;
  unitOfMeasureId:     number;
  unitOfMeasureSymbol: string;
  statusId:            number;
  statusName:          string;
  cultureId:           number;
  cultureName:         string;
  farmId:              number;
  farmName:            string;
  animalCapacity:      number | null;
  isActive:            boolean;
  createdAt:           string;
  updatedAt:           string;
}

export interface CreatePastureRequest {
  pastureNumber:   string;
  area:            number;
  unitOfMeasureId: number;
  statusId:        number;
  cultureId:       number;
  farmId:          number;
  animalCapacity:  number | null;
}

export interface UpdatePastureRequest {
  pastureNumber?:   string;
  area?:            number;
  unitOfMeasureId?: number;
  statusId?:        number;
  cultureId?:       number;
  animalCapacity?:  number | null;
}

// ── Maintenance Services ──────────────────────────────────────────────────────

export interface MaintenanceServiceResponse {
  id:                         number;
  description:                string;
  typeMaintenanceId:          number;
  typeMaintenanceDescription: string;
  isActive:                   boolean;
}

// ── Pasture Summary & History ─────────────────────────────────────────────────

export interface PastureSummaryResponse {
  totalPastures:                        number;
  pasturesWithoutMaintenanceOver180Days: number;
  pasturesInUse:                        number;
  pasturesResting:                      number;
  pasturesInRenovation:                 number;
}

export interface PastureHistoryResponse {
  id:                     number;
  pastureId:              number;
  maintenanceDate:        string;
  description:            string;
  maintenanceServiceId:   number | null;
  maintenanceServiceName: string | null;
  createdAt:              string;
}

export interface CreatePastureHistoryRequest {
  pastureId:            number;
  maintenanceDate:      string;
  description:          string;
  maintenanceServiceId: number | null;
}

// ── Shared ────────────────────────────────────────────────────────────────────

export interface FarmContactModel {
  id:        number;
  phone:     string | null;
  email:     string | null;
  isPrimary: boolean;
}

export interface UnitOfMeasureModel {
  id:          number;
  description: string;
  symbol:      string;
}

// ── Response (from ms-farm-process → to frontend) ────────────────────────────

export interface FarmOwnerModel {
  id:                      number;
  cnpjCpfNumber:           string;
  personType:              number;   // 1 = NaturalPerson, 2 = LegalPerson
  name:                    string;
  phone:                   string | null;
  email:                   string | null;
  participationPercentage: number;
}

export interface FarmModel {
  id:                       number;
  name:                     string;
  companyCnpjCpfNumber:     string | null;
  legalName:                string | null;
  stateRegistration:        string | null;
  municipalRegistration:    string | null;
  incraNumber:              string | null;
  area:                     number | null;
  unitOfMeasureId:          number | null;
  unitOfMeasureDescription: string | null;
  postalCode:               string | null;
  address:                  string | null;
  neighborhood:             string | null;
  city:                     string | null;
  state:                    string | null;
  contacts:                 FarmContactModel[];
  owners:                   FarmOwnerModel[];
  isActive:                 boolean;
  createdAt:                string;
  updatedAt:                string;
}

// ── Requests (from frontend → to ms-farm-process) ────────────────────────────

export interface CreateFarmContactRequest {
  phone:     string | null;
  email:     string | null;
  isPrimary: boolean;
}

export interface PersonContactRequest {
  type:      number;
  value:     string;
  isPrimary: boolean;
}

export interface CreateFarmOwnerRequest {
  cnpjCpfNumber:           string;
  personType:              number;  // 1 = NaturalPerson, 2 = LegalPerson
  name:                    string;
  contacts:                PersonContactRequest[];
  participationPercentage: number;
}

export interface UpdateFarmOwnerRequest {
  cnpjCpfNumber:           string;
  participationPercentage: number;
}

export interface CreateFarmRequest {
  name:                  string;
  companyCnpjCpfNumber:  string | null;
  legalName:             string | null;
  stateRegistration:     string | null;
  municipalRegistration: string | null;
  incraNumber:           string | null;
  area:             number | null;
  unitOfMeasureId:  number | null;
  postalCode:       string | null;
  address:          string | null;
  neighborhood:     string | null;
  city:             string | null;
  state:            string | null;
  contacts:         CreateFarmContactRequest[];
  owners:           CreateFarmOwnerRequest[];
}

export interface UpdateFarmRequest {
  name?:                  string;
  companyCnpjCpfNumber?:  string | null;
  legalName?:             string | null;
  stateRegistration?:     string | null;
  municipalRegistration?: string | null;
  incraNumber?:           string | null;
  area?:             number | null;
  unitOfMeasureId?:  number | null;
  postalCode?:       string | null;
  address?:          string | null;
  neighborhood?:     string | null;
  city?:             string | null;
  state?:            string | null;
  contacts?:         CreateFarmContactRequest[];
  owners?:           UpdateFarmOwnerRequest[];
}
