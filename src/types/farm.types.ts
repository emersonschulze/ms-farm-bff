// ── Shared ────────────────────────────────────────────────────────────────────

export interface PersonContactModel {
  type:      number;
  value:     string;
  isPrimary: boolean;
}

export interface FarmOwnerModel {
  description:             string;
  personType:              number;
  taxId:                   string | null;
  legalName:               string | null;
  relationshipType:        number;
  contacts:                PersonContactModel[];
  participationPercentage: number;
}

// ── Response (from ms-farm-process → to frontend) ────────────────────────────

export interface UnitOfMeasureModel {
  id:          number;
  description: string;
  symbol:      string;
}

export interface FarmOwnerResponse {
  id:                      string;
  personId:                string;
  personDescription:       string;
  personContacts:          PersonContactModel[];
  participationPercentage: number;
}

export interface FarmModel {
  id:                      string;
  description:             string;
  postalCode:              string | null;
  address:                 string | null;
  neighborhood:            string | null;
  city:                    string | null;
  state:                   string | null;
  contacts:                PersonContactModel[];
  companyTaxId:            string | null;
  legalName:               string | null;
  stateRegistration:       string | null;
  incraNumber:             string | null;
  area:                    number | null;
  unitOfMeasureId:         number | null;
  unitOfMeasureDescription: string | null;
  owners:                  FarmOwnerResponse[];
  createdAt:               string;
  updatedAt:               string;
}

// ── Requests (from frontend → to ms-farm-process) ────────────────────────────

export interface CreatePersonContactRequest {
  type:      number;
  value:     string;
  isPrimary: boolean;
}

export interface CreateFarmOwnerRequest {
  description:             string;
  personType:              number;
  taxId:                   string | null;
  legalName:               string | null;
  relationshipType:        number;
  contacts:                CreatePersonContactRequest[];
  participationPercentage: number;
}

export interface CreateFarmRequest {
  description:       string;
  postalCode:        string | null;
  address:           string | null;
  neighborhood:      string | null;
  city:              string | null;
  state:             string | null;
  relationshipType:  number;
  contacts:          CreatePersonContactRequest[];
  companyTaxId:      string | null;
  legalName:         string | null;
  stateRegistration: string | null;
  incraNumber:       string | null;
  area:              number | null;
  unitOfMeasureId:   number | null;
  owners:            CreateFarmOwnerRequest[];
}

export interface UpdateFarmRequest {
  description:       string;
  postalCode:        string | null;
  address:           string | null;
  neighborhood:      string | null;
  city:              string | null;
  state:             string | null;
  relationshipType:  number;
  contacts:          CreatePersonContactRequest[];
  companyTaxId:      string | null;
  legalName:         string | null;
  stateRegistration: string | null;
  incraNumber:       string | null;
  area:              number | null;
  unitOfMeasureId:   number | null;
  owners:            CreateFarmOwnerRequest[];
}
