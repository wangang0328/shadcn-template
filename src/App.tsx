
import { Button } from '@/components/ui/button'
// import Pagination2 from '@/components/pagination'
import { DataTable } from "@/components/table"
import { columns } from "@/components/table/columns"

import tasks from '@/components/table/data/tasks.json'

export default function PaginationDemo() {

  return (
    <div>
      <Button>hello</Button>
      <DataTable data={tasks} columns={columns} />

      {/* <Pagination2 total={1000}></Pagination2> */}
    </div>
  )
}
