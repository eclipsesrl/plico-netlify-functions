export interface SaleState {
  type: string;
  rate: number;
  area: AreaType;
  exchange: ExchangeType;
  charge: Charge;
}

export interface SaleStateWithTotal extends SaleState{
    total: number
}

export interface Charge {
  direct: boolean;
  reverse: boolean;
}

export enum AreaType {
  REGIONAL = 'regional',
  WORLDWIDE = 'worldwide',
  NATIONAL = 'national'
}

export enum ExchangeType {
    CONSUMER = 'consumer',
    BUSINESS = 'business'
}