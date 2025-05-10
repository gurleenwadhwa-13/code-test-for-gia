import type { ColumnDef } from "@tanstack/react-table"

export type UserData = {
    _id: string,
    userId: string,
    company: {
      name: string
    },
    firstName: string,
    lastName: string,
    jobTitle: string,
    tier: number
}

export const columns: ColumnDef<UserData>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "company[name]",
    header: "Company",
  },
  {
    accessorKey: "tier",
    header: "Tier",
  }
]
