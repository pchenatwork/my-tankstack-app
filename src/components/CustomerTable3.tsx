// UserTable.tsx
import React, { useState } from 'react';
import { type Customer } from '../apis/customer';
import type { PagedRequest} from '../types/common';
import useDebounce from '../hooks/useDebounce';
import { usePagedData } from '../hooks/usePagedData';
import {Button, Space, Table} from 'antd'
import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
import { isUnBorderedButtonVariant } from 'antd/es/button';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

const PAGE_SIZE = 10;

type PagedRequestGetCustomers = PagedRequest<Customer> & { country: string };

export const CustomerTable3: React.FC = () => {
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

  const columns : ColumnsType<Customer> = [
    { title: 'Cust ID',
        dataIndex: 'customerId',
        key: 'customerId',
        sorter: true,
    },
    { title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
        sorter: true
    },
    { title: 'Contact Name',
        dataIndex: 'contactName',
        key: 'contactName',
        sorter: true
    },
    { title: 'Address',
        dataIndex: 'address',
        key: 'address',
        sorter: false,
        render: (text, record) => (
            <>
              <div>'text' = {text}; </div>              
              <div>'record' (full) = {record.address}              
              {record.city} {record.region} {record.postalCode} </div>
            </>
        )
    },
    { title: 'Action',
      //  dataIndex: 'customerId',
        key: 'action',
        sorter: false,
        render: (_, record) => (
            <Space size="middle">
              <Button type="link" onClick={() => alert(`Editing ${record.contactName}`)}>
                Edit
              </Button>
              <Button type="link" onClick={() => alert(`Deleting ${record.contactName}`)}>
                Delete
              </Button>
            </Space>
          )
    }
  ]

  const handleTableChange: TableProps<Customer>['onChange'] = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Customer> | SorterResult<Customer>[],
    extra: any // extra is optional and contains the currentDataSource
  ) => {
    //console.log('Pagination:', pagination);
    //console.log('Filters:', filters);
    console.log('Sorter:', sorter);
    //console.log('Extra:', extra);
    
    const sorterResult = sorter as SorterResult<Customer>;
    if (sorterResult.field) {
        const sortColumn = sorterResult.field as keyof Customer;
        const isDescending = sorterResult.order !== 'ascend';
        console.log(`sortColumn = ${sortColumn} isDescending=${isDescending}`)
        setTableState({
            ...tableState,
            sortColumn: sortColumn,
            isDescending: isDescending
          });
    }

    // You can use the parameters to update the state and fetch new data if needed
  };

  return (
    <div>
      <input type="text" value={filterString} onChange={onFilterChange} />

      <Table dataSource={data.items} columns={columns} pagination={false} onChange={handleTableChange} />

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
