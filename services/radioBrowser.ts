
import { Station } from '../types';

const API_BASE_URL = 'https://all.api.radio-browser.info/json/stations/search';

export const searchStations = async (query: string): Promise<Station[]> => {
  if (!query.trim()) return [];
  
  const url = `${API_BASE_URL}?limit=50&hidebroken=true&order=clickcount&reverse=true&name=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data: Station[] = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    return [];
  }
};
