import {
  Table as ShadeTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { type Table, flexRender } from '@tanstack/react-table'
import React, { CSSProperties, useEffect } from "react"
import Pagination from "../pagination"
import NoData from "./components/NoData"
import { isUndefined } from "lodash-es"
import Spinner from "./components/Spinner"

interface IProps {
  table: Table<any>,
  paginaion: false | any
}

const sizeFormat = (v?: number) => {
  if (isUndefined(v)) {
    return undefined
  }
  return `${v}px`
}

const formatSize = (header, sizeInfo) => {
  return {
    width: sizeFormat(header.getSize()),
    minWidth: sizeFormat(sizeInfo[header.id]?.minSize),
    maxWidth: sizeFormat(sizeInfo[header.id]?.maxSize)
  }
}

// 固定列 
const getCommonPinningStyles = (column: any): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: isPinned ? 'sticky' : 'relative',
    // width: sizeFormat(column.getSize()),
    zIndex: isPinned ? 1 : 0,
  }
}

const InternalTable: React.FC<IProps> = ({ table, loading, pagination, pinnerInfo, sizeInfo, alignInfo = {} }) => {
  const columnsLength = table.getAllColumns().length
  console.log('table.getRowModel()', table.getState())

  useEffect(() => {
    // 处理固定列
    const finalPinner = pinnerInfo ?? {}
    console.log('finalPinner=-', finalPinner)
    table.getHeaderGroups().forEach((headerGroup) => {
      headerGroup.headers.forEach((header) => {
        console.log('finalPinner[header.id]', finalPinner[header.id], header.id)
        header.column.pin(finalPinner[header.id] ?? false)
      })
    })
  }, [pinnerInfo])

  // useEffect(() => {
  //   // 处理固定列
  //   const finalPinner = sizeInfo ?? {}
  //   console.log('finalPinner=-', finalPinner)
  //   table.getHeaderGroups().forEach((headerGroup) => {
  //     headerGroup.headers.forEach((header) => {
  //       console.log('finalPinner[header.id]', finalPinner[header.id], header.id)
  //       header.column.pin(finalPinner[header.id] ?? false)
  //     })
  //   })
  // }, [sizeInfo])

  // console.log(table.getAllColumns(), 'sizeFormat(header.getSize())')
  return (
    <>
      <ShadeTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                console.log('getCommonPinningStyles(header.column)', getCommonPinningStyles(header.column))
                return (
                  <TableHead key={header.id} colSpan={header.colSpan} style={{ ...formatSize(header, sizeInfo), textAlign: alignInfo[header.id], ...getCommonPinningStyles(header.column) }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  // console.log('cell.id', cell.column.id, alignInfo[cell.id])
                  return (
                  <TableCell key={cell.id} style={{ textAlign: alignInfo[cell.column.id], ...getCommonPinningStyles(cell.column)}}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                )})}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsLength}
                className="h-24 text-center"
              >
                <NoData />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadeTable>
      {pagination !!== false && <Pagination {...pagination} />}
    </>
  )
}

export default InternalTable
