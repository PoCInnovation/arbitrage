export type Token = {
  volume: number;
  name: string;
  symbol: string;
  decimal: number;
}

export type Pool = {
  dexName: string;
  token1: Token;
  token2: Token;
  price: number;
  address: string;
  fees: number;
}
