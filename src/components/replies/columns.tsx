'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { ArrowUpDown, ArrowUpLeftFromSquare, MoreHorizontal } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useRouter } from "next/navigation"

export type Replies = {
    id?: string | null
    postId?: string | null
    title?: string | null
    postAuthor?: string | null
    reply?: string | null
    projectId?: string | null
    createdAt?: any
  }
  
  export const columns: ColumnDef<Replies>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
               Post Title
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
      accessorKey: "postAuthor",
      header: ({ column }) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
               Author
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
      accessorKey: "reply",
        header: ({ column }) => {
            return (
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                 AI Reply
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            )
          },
      },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
          return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
               Reply Created
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
        
          // const createdAt = new Date(row.getValue("createdAt")).toLocaleString()
          const createdAt: Date = row.getValue("createdAt");
  
          const distanceToNow = formatDistanceToNow(createdAt, {includeSeconds: true, addSuffix: true });
    
          return (
            <div>
              {distanceToNow}
            </div>
          )
        }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const { id } = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-4 focus-visible:ring-indigo-500 focus-visible:ring-offset-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" >
              <a>
                 <DropdownMenuItem className="cursor-pointer">
                   <ArrowUpLeftFromSquare className="h-4 w-4 mr-2"/>
                     See post
                 </DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]