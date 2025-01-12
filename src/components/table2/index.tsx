import { cn } from '@src/lib/utils'
import Pagination from '@components/pagination'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { flexRender } from '@tanstack/react-table'
import React, { useEffect, useMemo, useRef } from 'react'
import InternalSticky from './components/InternalSticky'
import NoData from './components/NoData'
import type { TableProps } from './interface'
import { formatSize, getCommonPinningStyles } from './utils'
// 重写的 shade的table，
import InternalColGroup from './components/InternalColGroup'
import ShadeTable from './components/ShadeTable'
import TableOperator from './components/TableOperator'
import TableFilter from './components/table-filter'
import { TableContext } from './TableContext'



const InternalTable: React.FC<TableProps> = ({
  table,
  pagination,
  loading,
  pinnerInfo,
  sizeInfo,
  stickyHeaderInfo = {},
  alignInfo = {},
  operatorInfo,
  filters
}) => {
  console.log('loading--', loading)
  // 是否固定表格头
  const isStickyHeader = stickyHeaderInfo !== null
  const columnsLength = table.getAllColumns().length
  const tableBodyRef = useRef(null)
  // const headerTopRef = useRef(null)
  // const headerBottomRef = useRef(null)
  // const scrollTableX = useScroll(tableBodyRef)

  // const [isTop, setIsTop] = useState(false)
  // console.log('table.getRowModel()', table.getState())
  console.log(JSON.stringify(scroll), 'JSON.stringify(scroll)')
  useEffect(() => {
    // 处理固定列
    const finalPinner = pinnerInfo ?? {}
    table.getHeaderGroups().forEach((headerGroup) => {
      headerGroup.headers.forEach((header) => {
        header.column.pin(finalPinner[header.id] ?? false)
      })
    })
  }, [pinnerInfo, table])

  // 获取表格头到顶部的距离
  // useEffect(() => {
  //   // 获取顶部到
  //   console.log('tableBodyRef.current', tableBodyRef.current)
  //   // @ts-ignore
  //   console.log(tableBodyRef.current!.offset().top, 'tableBodyRef.current.offset().top')
  // }, [scrollY])
  const sizeStyle = useMemo(() => {
    const sizeData: Record<string, ReturnType<typeof formatSize>> = {}
    table.getHeaderGroups().forEach((headerGroup) => {
      headerGroup.headers.forEach((header) => {
        sizeData[header.id] = formatSize(header, sizeInfo)
      })
    })
    return sizeData
  }, [table, sizeInfo])

  return (
    <>
      {filters}
      {isStickyHeader && (
        <InternalSticky
          alignInfo={alignInfo}
          tableBodyRef={tableBodyRef}
          table={table}
          stickyHeaderInfo={stickyHeaderInfo}
          sizeStyle={sizeStyle}
        />
      )}
      <TableOperator operatorInfo={operatorInfo} table={table} tableBodyRef={tableBodyRef} />
      <ShadeTable ref={tableBodyRef}>
        <InternalColGroup table={table} />
        <TableHeader className="text-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { style, className } = getCommonPinningStyles(header.column)
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...sizeStyle[header.id],
                      textAlign: alignInfo[header.id],
                      ...style
                    }}
                    className={`bg-white ${className}`}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="group" key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  const { style, className } = getCommonPinningStyles(cell.column)
                  return (
                    <TableCell
                      key={cell.id}
                      style={{ textAlign: alignInfo[cell.column.id], ...style }}
                      className={cn(
                        'bg-white group-hover:bg-muted group-data-[state=selected]:bg-muted text-muted-foreground',
                        className
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsLength} className="h-24 text-center">
                <NoData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadeTable>
      {pagination !== null && <Pagination {...pagination} />}
    </>
  )
}




const TableWrapper = ({ table, ...restProps }: any) => (
  <TableContext.Provider value={table}>
    <InternalTable table={table} {...restProps} />
  </TableContext.Provider>
)

export default TableWrapper
