import axios from "axios";
import type { PagedRequest, PagedResponse } from "../types/common"

const BASE_URL = 'https://localhost:7257/api';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { },
});

export async function fetchPagedDateAsync<T>(
  url: string, 
  params: PagedRequest<T>
): Promise<PagedResponse<T>> {
  const response = await api.post<PagedResponse<T>>(url, params);
  return response.data;
}