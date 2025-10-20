
export enum ImageStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface ImageResult {
  id: string;
  prompt: string;
  imageUrl: string | null;
  status: ImageStatus;
  error?: string;
}
