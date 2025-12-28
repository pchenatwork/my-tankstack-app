import axios from 'axios';
import type { PagedResponse,  PagedRequest } from '../types/common';

export type Customer = {
  customerId: string,
  companyName: string,
  contactName: string,
  contactTitle: string,
  address: string,
  city: string,
  region: string,
  postalCode: string,
  country: string,
  phone: string,
  fax: string
}

export type FetchCustomersParams = PagedRequest<Customer> & {
  country: string
}


export async function fetchCustomers(
  params: FetchCustomersParams
): Promise<PagedResponse<Customer>> {
  const response = await axios.post<PagedResponse<Customer>>(
    'https://localhost:7257/api/Demo', params
  );
  return {
    items: response.data.items,
    totalNumber: response.data.totalNumber,
    filteredNumber: response.data.filteredNumber
  };
}


  /*
export async function fetchComments(
  params: FetchCustomersParams
): Promise<PagedResponse<Customer>> {
  const requestX : FetchCustomersParams = {
    country: 'USA',
    filter: "",
    sortColumn : 'customerId',
    isDescending: true,
    pageNumber: 2,
    pageSize : 7
  }
  const responseX = await axios.post<PagedResponse<Customer>>(
    'https://localhost:7257/api/Demo', requestX
  ).then(x=> console.log(`response = ${JSON.stringify(x)}`))  
  .catch(function (error) {
    console.log(error);
  });
  return responseX.
  const response = await axios.get<Comment[]>(
    'https://example.com/api/Comments',
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      },
    }
  );
  return {
    data: response.data,
    total: Number(response.headers['x-total-count']),
  };
}*/