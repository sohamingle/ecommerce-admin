"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type ProductColumn = {
  id: string
  name: string
  price: string
  isFeatured: boolean
  isArchived: boolean
  size: string
  category: string
  color: string
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell:({row})=>(
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="border rounded-full w-4 h-4" style={{backgroundColor:row.original.color}}></div>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:'actions',
    cell:({row})=><CellAction data={row.original}/>
  }
]
