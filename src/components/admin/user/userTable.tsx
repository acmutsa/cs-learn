'use client';
import * as React from "react"
import type { NextRequest } from "next/server";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Users } from "@/lib/types";
import { useEffect, useState } from "react";

import { getAllRegularUsers, getAllUsers, updateUserEmail, updateUserName } from "@/actions/admin/user";


type Props = { user: Users[]; isSuperAdmin: boolean };


export default function Usertable({user , isSuperAdmin }) : Props {
  const [data, setData] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{name: string; email: string; role: string} | null>(null);

  const startEdit = (row: Users) => {
    setEditRowId(row.id);
    setDraft({ name: row.name, email: row.email, role: row.role });
  };
  const cancelEdit = () => { setEditRowId(null); setDraft(null); };

  const save = async (id: string) => {
    if (!draft) return;
    await updateUserName(id, draft.name); 
    await updateUserEmail(id, draft.email); 
    setData((prev) => prev.map(u => u.id === id ? { ...u, ...draft } : u));
    cancelEdit();
  };


  const columns: ColumnDef<Users>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="cursor-pointer text-center"
            >
              Username
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const isEditing = editRowId === row.original.id;
        if(!isEditing) return <div className="text-left pl-3">{row.getValue("name")}</div>;
        return (
          <Input
            value={draft?.name?? ""}
            onChange={(e) => setDraft((d) => d ? { ...d, name: e.target.value } : d)}
            className="h-8"
          />
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="cursor-pointer"
            >
              Email
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const isEditing = editRowId === row.original.id;
        if(!isEditing) return <div className="text-left pl-3">{row.getValue("email")}</div>
        return (
          <Input 
            value={draft?.email?? ""}
            onChange={(e) => setDraft((d) => d? {...d, email: e.target.value} : d)}
            className="h-8"
          />
        )
      }
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <div className="text-left">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="cursor-pointer"
            >
              role
              <ArrowUpDown />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => 

        <div className="pr-3">{row.getValue("role")}</div>
      
        
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const isEditing = editRowId === row.original.id;

        if (isEditing) {
          return (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => save(row.original.id)}>Save</Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
            </div>
          );
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => startEdit(row.original) }
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => console.log("delete user")}
              >Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]
  const fetchUsers = async () => {
    setLoading(true);
    let result;
    if (!isSuperAdmin){
      result = await getAllRegularUsers();
    }else{
      result = await getAllUsers();
    }
      
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: data,
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
  });

  return (
    <div className="w-full">

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter tags..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
              return (
                <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
        <div className="text-muted-foreground flex-1 text-sm">
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
