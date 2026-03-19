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
