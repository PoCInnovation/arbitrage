export type Token = {
  name: string;
  symbol: string;
  decimal: number;
  address: string;
}

export type TokenWithVolume = Token & {volume: number;}

export type Pool = {
  dexName: string;
  token1: TokenWithVolume;
  token2: TokenWithVolume;
  price: number;
  address: string;
  fees: number;
}

export type Input = {
  token1: Token;
  token2: Token;
}