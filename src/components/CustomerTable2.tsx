// UserTable.tsx
import React, { useState } from 'react';
import { type Customer } from '../apis/customer';
import type { PagedRequest} from '../types/common';
import useDebounce from '../hooks/useDebounce';
import { usePagedData } from '../hooks/usePagedData';

const PAGE_SIZE = 10;

type PagedRequestGetCustomers = PagedRequest<Customer> & { country: string };

export const CustomerTable2: React.FC = () => {
  const [requestParams, setRequestParams] = useState<PagedRequestGetCustomers>({
    country: "",
    filter: '',
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    sortColumn: "customerId",
    isDescending: false
  });
  const [filterString, setFilterString] = useState('');
  const debouncedFilter = useDebounce<string>(filterString, 1000);

  const myPagedRequest : PagedRequestGetCustomers = {...requestParams, filter: debouncedFilter};

  const {data, isLoading, isError} = usePagedData<Customer>('demo', myPagedRequest);

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
