import { DataTable } from "./components/DataTable"
import { columns } from "./components/ui/columns"
import data from "./data/data.json"

function App() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Audience Table</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default App
