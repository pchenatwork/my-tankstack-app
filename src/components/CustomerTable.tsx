// UserTable.tsx
import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { type Customer } from '../apis/customer';
import type { PagedRequest, PagedResponse} from '../types/common';
import useDebounce from '../hooks/useDebounce';
import { fetchPagedDateAsync } from '../apis/comment';
import axios from 'axios';

const PAGE_SIZE = 10;

type PagedRequestGetCustomers = PagedRequest<Customer> & { country: string };

/* Original function to fetch customers, obsolete  by fetchPagedDateAsync */
async function fetchCustomers(
  params: PagedRequestGetCustomers
): Promise<PagedResponse<Customer>> {
  console.log('fetchCustomers', JSON.stringify(params));
  const response = await axios.post<PagedResponse<Customer>>(
    'https://localhost:7257/api/Demo', params
  );
  return {
    items: response.data.items,
    totalNumber: response.data.totalNumber,
    filteredNumber: response.data.filteredNumber
  };
}
/**/

export const CustomerTable: React.FC = () => {
  const iniRequestParams : PagedRequestGetCustomers = {
    country: "USA",
    filter: '',
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    sortColumn: "companyName",
    isDescending: false
  }

  const [filterString, setFilterString] = useState('');
  const debouncedFilterString = useDebounce<string>(filterString);
  const [requestParams, setRequestParams] = useState<PagedRequestGetCustomers>(iniRequestParams);

  const myRequestParams : PagedRequestGetCustomers = {...requestParams, filter: debouncedFilterString};

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(event.target.value);
    setRequestParams({
      ...requestParams,
      filter: filterString
    });
  };
  const handlePageNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && requestParams.pageNumber > 1) {
      setRequestParams({
        ...requestParams,
        pageNumber: requestParams.pageNumber - 1
      });
    } else if (direction === 'next' && requestParams.pageNumber < totalPages) {
      setRequestParams({
        ...requestParams,
        pageNumber: requestParams.pageNumber + 1
      });
    }
  };

  const { data , isLoading, isError } = useQuery({
    //queryKey: ['customers', { ...requestParams, filterString: debouncedFilterString}],
    queryKey: ['customers', { ...myRequestParams}],
    queryFn: () =>
      fetchPagedDateAsync<Customer>('Demo', myRequestParams)
      //fetchCustomers(myRequestParams)
    ,
   placeholderData: keepPreviousData
  });

/*
  const { data, isLoading, isError } = useQuery({
    queryKey: ['customers', country, filter, pageNumber, sortColumn, isDescending],
    queryFn: () =>
      fetchCustomers({
        country,
        filter,
        pageNumber,
        pageSize: PAGE_SIZE,
        sortColumn,
        isDescending,
      }),
    })
 */
  const handleSort = (column: keyof Customer) => {
    column === requestParams.sortColumn 
    ?    setRequestParams({
        ...requestParams,
        isDescending: !requestParams.isDescending
      })
      : setRequestParams({
        ...requestParams,
        sortColumn: column
      });
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading data</p>;

  const totalPages = Math.ceil(data.filteredNumber / PAGE_SIZE);

  return (
    <div>
      <input type="text" value={filterString} onChange={onFilterChange} />
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('customerId')}>
              ID {requestParams.sortColumn === 'customerId' && `(${requestParams.isDescending})`}
            </th>
            <th onClick={() => handleSort('companyName')}>
              Name {requestParams.sortColumn === 'companyName' && `(${requestParams.isDescending})`}
            </th>
            <th onClick={() => handleSort('contactName')}>
              Name {requestParams.sortColumn === 'contactName' && `(${requestParams.isDescending})`}
            </th>
            <th onClick={() => handleSort('contactTitle')}>
              Email {requestParams.sortColumn === 'contactTitle' && `(${requestParams.isDescending})`}
            </th>
          </tr>
        </thead>

        <tbody>
          {data.items.map((customer) => (
            <tr key={customer.customerId}>
              <td>{customer.customerId}</td>
              <td>{customer.companyName}</td>
              <td>{customer.contactName}</td>
              <td>{customer.contactTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={() => handlePageNav('prev')}
          disabled={requestParams.pageNumber === 1}
        >
          Prev
        </button>

        <span style={{ margin: '0 8px' }}>
          Page {requestParams.pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => handlePageNav('next')}
          disabled={requestParams.pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
