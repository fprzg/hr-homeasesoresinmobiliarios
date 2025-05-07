import { createFileRoute, Link, Navigate, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { InmuebleType } from '@shared/zod';
import { DocumentosApi, ArchivosApi } from '@/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useReducer } from 'react';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute('/dash/_authenticated/docs/listar')({
  component: ComponentLayout,
});

function ComponentLayout() {
  const navigate = useNavigate();

  const columns: ColumnDef<InmuebleType>[] = [
    {
      accessorKey: "titulo",
      header: "Título",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("titulo")}</div>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("categoria")}</div>
      ),
    },
    {
      accessorKey: "precio",
      header: () => <div className="text-right">Previo</div>,
      cell: ({ row }) => {
        const precio = parseFloat(row.getValue("precio"));
        console.log(precio)
        const formateado = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(precio);

        return <div className="text-right font-medium">{formateado}</div>
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const btnClassName = "h-8 rounded-md px-0";
        const documentoId = row.getValue("id");

        return (
          <div className='grid grid-cols-2 gap-4 mx-auto'>
            <Button className={btnClassName} onClick={() => navigate({ to: `/dash/docs/editar${documentoId}` })}>Editar</Button>
            <Button variant="destructive" className={btnClassName}>Eliminar</Button>
          </div>
        )

        /*
        const payment = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem>Editar</DropdownMenuItem>
              <DropdownMenuItem>Eliminar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
        */
      },
    },
  ];

  async function getDocumentos() {
    const res = await api.documentos.$get();
    if (!res.ok) {
      throw new Error('server error');
    }
    const data = await res.json();
    return data;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-documentos-x'],
    queryFn: getDocumentos,
  });

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable<InmuebleType>({
    data: (isPending ? [] : data?.documentos) as InmuebleType[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })


  //if (isPending) return <div>Cargando inmuebles...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="grid gap-4">
      <div className="text-xl text-center">Inmuebles</div>
      <div className="">
        <Button className='' onClick={() => navigate({ to: '/dash/docs/nuevo-casa' })}>
          Agregar casa
        </Button>
        <Button className='' onClick={() => navigate({ to: '/dash/docs/nuevo-terreno' })}>
          Agregar terreno
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
