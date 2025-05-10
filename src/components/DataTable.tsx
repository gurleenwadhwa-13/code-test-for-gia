import { useMemo, useState } from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

export type RowData = {
  _id: string
  userId: string
  company: {
    name: string
  }
  firstName: string
  lastName: string
  jobTitle: string
  tier: number
}

interface DataTableProps<TData extends RowData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends RowData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [nameFilter, setNameFilter] = useState("")
  const [jobTitleFilter, setJobTitleFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [tierFilters, setTierFilters] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  })

  const handleTierChange = (tier: number) => {
    setTierFilters({
      ...tierFilters,
      [tier]: !tierFilters[tier as keyof typeof tierFilters],
    })
  }

  const clearFilters = () => {
    setNameFilter("")
    setJobTitleFilter("")
    setCompanyFilter("")
    setTierFilters({
      1: false,
      2: false,
      3: false,
      4: false,
    })
  }

  const filteredData = useMemo(() => {
    return data.filter((person) => {
      const nameMatch = nameFilter === "" || `${person.firstName} ${person.lastName}`.toLowerCase().includes(nameFilter.toLowerCase())
      const jobTitleMatch = jobTitleFilter === "" || person.jobTitle.toLowerCase().includes(jobTitleFilter.toLowerCase())
      const companyMatch = companyFilter === "" || person.company.name.toLowerCase().includes(companyFilter.toLowerCase())
      const tierMatch = (!tierFilters[1] && !tierFilters[2] && !tierFilters[3] && !tierFilters[4]) || tierFilters[person.tier as keyof typeof tierFilters]
      return nameMatch && jobTitleMatch && companyMatch && tierMatch
    })
  }, [data, nameFilter, jobTitleFilter, companyFilter, tierFilters])

  const hasActiveFilters =
    nameFilter !== "" ||
    jobTitleFilter !== "" ||
    companyFilter !== "" ||
    Object.values(tierFilters).some((value) => value)

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Filters</span>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name-filter">Name</Label>
              <Input
                id="name-filter"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-title-filter">Job Title</Label>
              <Input
                id="job-title-filter"
                placeholder="Search by job title..."
                value={jobTitleFilter}
                onChange={(e) => setJobTitleFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-filter">Company</Label>
              <Input
                id="company-filter"
                placeholder="Search by company..."
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Tier</Label>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((tier) => (
                  <div key={tier} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tier-${tier}`}
                      checked={tierFilters[tier as keyof typeof tierFilters]}
                      onCheckedChange={() => handleTierChange(tier)}
                    />
                    <Label htmlFor={`tier-${tier}`} className="font-normal">
                      Tier {tier}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DataTable
