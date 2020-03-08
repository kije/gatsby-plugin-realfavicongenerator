import path from 'path';

export const CACHE_PATH = path.resolve('.cache/realfavicongenerator');
export const PUBLIC_PATH = '/favicons';
export const RESPONSE_CACHED_PATH = path.join(CACHE_PATH, 'response.json');
export const RESPONSE_PUBLIC_PATH = path.join(
  'public',
  PUBLIC_PATH,
  'response.json',
);
