// UserTable.tsx
import React, { useState } from 'react';
import { type Customer } from '../apis/customer';
import type { PagedRequest} from '../types/common';
import useDebounce from '../hooks/useDebounce';
import { usePagedData } from '../hooks/usePagedData';

const PAGE_SIZE = 10;

type PagedRequestGetCustomers = PagedRequest<Customer> & { country: string };

export const CustomerTable2: React.FC = () => {
  const [tableState, setTableState] = useState<PagedRequestGetCustomers>({
    country: "",
    filter: '',
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    sortColumn: "customerId",
    isDescending: false
  });
  const [filterString, setFilterString] = useState('');
  const debouncedFilter = useDebounce<string>(filterString, 1000);

  const myPagedRequest : PagedRequestGetCustomers = {...tableState, filter: debouncedFilter};

  const {data, isLoading, isError} = usePagedData<Customer>('demo', myPagedRequest);

  const onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterString(event.target.value);
  };
  const handlePageNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && tableState.pageNumber > 1) {
      setTableState({
        ...tableState,
        pageNumber: tableState.pageNumber - 1
      });
    } else if (direction === 'next' && tableState.pageNumber < totalPages) {
      setTableState({
        ...tableState,
        pageNumber: tableState.pageNumber + 1
      });
    }
  };
  const handleSort = (column: keyof Customer) => {
    column === tableState.sortColumn 
    ?    setTableState({
        ...tableState,
        isDescending: !tableState.isDescending
      })
      : setTableState({
        ...tableState,
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
              ID {tableState.sortColumn === 'customerId' && `(${tableState.isDescending})`}
            </th>
            <th onClick={() => handleSort('companyName')}>
              Name {tableState.sortColumn === 'companyName' && `(${tableState.isDescending})`}
            </th>
            <th onClick={() => handleSort('contactName')}>
              Name {tableState.sortColumn === 'contactName' && `(${tableState.isDescending})`}
            </th>
            <th onClick={() => handleSort('contactTitle')}>
              Email {tableState.sortColumn === 'contactTitle' && `(${tableState.isDescending})`}
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
          disabled={tableState.pageNumber === 1}
        >
          Prev
        </button>

        <span style={{ margin: '0 8px' }}>
          Page {tableState.pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => handlePageNav('next')}
          disabled={tableState.pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
