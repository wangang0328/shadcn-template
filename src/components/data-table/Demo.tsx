import Table from './Table'
import useTable from './useTable'
import tasks from '@/components/table/data/tasks.json'
import { columns } from "@/components/table/columns"

const fetchTable = (params) => {
  console.log('请求参数--', params)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: tasks.slice(0, 10),
        page: {
          pageSize: 0,
          pageIndex: 1,
          total: 1000
        }
      })
    }, 3000)
  })
}

const Demo = () => {
  const { table, tableProps } = useTable(fetchTable, {
    columns,
    requestOptions: {
      // manual: false
    },
    rowKey: 'id'
  })
  console.log('update----------------', table.getState().rowSelection)
  return (
    <Table {...tableProps} />
  )
}

export default Demo
