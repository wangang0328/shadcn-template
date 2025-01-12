import { Input } from '@/components/ui/input'
import FilterItem from '../components/table-filter'
import Table from '../index'
import useTable from '../useTable'
import { columns, operatorInfo } from './constant'
import tasks from './mock.json'

console.log('document----------', document.querySelector('#yq_children_wrap'))
const fetchTable = (params: any) => {
  console.log('请求参数--', params)
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve({
        data: tasks.slice(0, 100),
        pagination: {
          pageSize: 0,
          pageIndex: 1,
          total: 1000
        }
      })
    }, 3000)
  })
}


const filterList = (table: any) => [
  <FilterItem table={table} id="id" label="hello">
    <Input />
  </FilterItem>
]

const Demo = () => {
  const { table, tableProps } = useTable(fetchTable, {
    // @ts-ignore
    columns,
    requestOptions: {
      // manual: false
    },
    rowKey: 'id'
  })
  console.log('update----------------', table.getState().rowSelection)
  return (
    <>
      <div className="h-20 bg-slate-400"></div>
      <Table {...tableProps} operatorInfo={operatorInfo} filters={filterList(table)} />
    </>
  )
}

export default Demo
