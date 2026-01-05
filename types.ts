
export interface Station {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved?: string;
  favicon?: string;
  country?: string;
  language?: string;
  tags?: string;
  clickcount?: number;
}

export interface FavoriteStation {
  uuid: string;
  name: string;
  url: string;
}

export enum PlayerStatus {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  LOADING = 'loading',
  ERROR = 'error'
}
