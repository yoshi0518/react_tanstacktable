import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageSize, setPageSize] = useState(30);
  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      setPosts(await response.json());
    };

    getPosts();
  }, []);

  const updateRow = (id: number) => console.log(`update: ${id}`);
  const deleteRow = (id: number) => console.log(`delete: ${id}`);

  const columnHelper = createColumnHelper<Post>();
  const columns = [
    columnHelper.accessor('userId', { header: 'User ID' }),
    columnHelper.accessor('id', { header: 'ID' }),
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (props) => props.getValue().toUpperCase(),
    }),
    columnHelper.accessor((row) => `[Body] ${row.body}`, { header: 'Body' }),
    columnHelper.display({
      id: 'update',
      header: '',
      cell: (props) => (
        <button type='button' onClick={() => updateRow(props.row.original.id)}>
          更新
        </button>
      ),
    }),
    columnHelper.display({
      id: 'delete',
      header: '',
      cell: (props) => (
        <button type='button' onClick={() => deleteRow(props.row.original.id)}>
          削除
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 30 } },
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div style={{ margin: '2em' }}>
      <h1 className='text-center text-semibold text-2xl mb-4'>React TanstackTable Test</h1>
      <p>Rows Number: {table.getRowModel().rows.length}</p>
      <p>Page Count: {table.getPageCount()}</p>
      <div style={{ display: 'flex', marginBottom: '2em' }}>
        <button type='button' disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
          Privious
        </button>
        <button type='button' disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
          Next
        </button>
        {Array.from({ length: table.getPageCount() }, (_, i) => i).map((index) => (
          <button
            type='button'
            key={index}
            style={{
              padding: '0 0.5em 0 0.5em',
              margin: '0 0.2em 0 0.2em',
              cursor: 'pointer',
            }}
            onClick={() => table.setPageIndex(index)}
          >
            {index + 1}
          </button>
        ))}
        <select
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
            setPageSize(Number(e.target.value));
          }}
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
