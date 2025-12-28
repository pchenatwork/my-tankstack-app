import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PagedRequest, PagedResponse } from "../types/common";
import { api } from "../apis/comment";


async function fetchPagedDateAsync<T>(
    path: string, 
    params: PagedRequest<T>
  ): Promise<PagedResponse<T>> {
    const response = await api.post<PagedResponse<T>>(path, params);
    return response.data;
  };

/**
 * Hook for getting generic PagedResponse\<T\> from API
 * @param path API resource path
 * @param params PagedRequest\<T\> 
 * @returns \{PagedResponse\<T\>, isLoading, isError\}
 */
export const usePagedData= <T>(path: string, params: PagedRequest<T>) => {
    //return useQuery<PagedResponse<T>, Error>({
    return useQuery({
        queryKey: [{...params}],
        queryFn: ()=>fetchPagedDateAsync<T>(path, params),
        placeholderData: keepPreviousData,
    });
};
