
import { Button } from '@/components/ui/button'
// import Pagination2 from '@/components/pagination'
import { DataTable } from "@/components/table"
import { columns } from "@/components/table/columns"

import tasks from '@/components/table/data/tasks.json'
// import Demo from '@/components/data-table/Demo'
import Table from '@components/table2/demo/Demo1'

export default function PaginationDemo() {

  return (
    <div>
      <DataTable data={tasks} columns={columns} />
      <Button>hello</Button>
      <Table />
      {/* <Demo /> */}

      {/* <Pagination2 total={1000}></Pagination2> */}
    </div>
  )
}
