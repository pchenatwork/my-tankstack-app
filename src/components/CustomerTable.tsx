// UserTable.tsx
import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchCustomers, type Customer } from '../apis/customer';

const PAGE_SIZE = 10;

export const CustomerTable: React.FC = () => {
    const [country, setCountry] = useState<string>("")
    const [filter, setFilter] = useState<string>("")
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<keyof Customer>('companyName');
  const [isDescending, setIsDescending] = useState<boolean>(false);

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
      placeholderData: keepPreviousData
  });

  const handleSort = (column: keyof Customer) => {
    if (column === sortColumn) {
      setIsDescending((prev) => !prev);
    } else {
      setSortColumn(column);
      setIsDescending(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading data</p>;

  const totalPages = Math.ceil(data.filteredNumber / PAGE_SIZE);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('customerId')}>
              ID {sortColumn === 'customerId' && `(${isDescending})`}
            </th>
            <th onClick={() => handleSort('companyName')}>
              Name {sortColumn === 'companyName' && `(${isDescending})`}
            </th>
            <th onClick={() => handleSort('contactName')}>
              Name {sortColumn === 'contactName' && `(${isDescending})`}
            </th>
            <th onClick={() => handleSort('contactTitle')}>
              Email {sortColumn === 'contactTitle' && `(${isDescending})`}
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
          onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
          disabled={pageNumber === 1}
        >
          Prev
        </button>

        <span style={{ margin: '0 8px' }}>
          Page {pageNumber} of {totalPages}
        </span>

        <button
          onClick={() => setPageNumber((p) => Math.min(p + 1, totalPages))}
          disabled={pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
