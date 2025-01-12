import { cn } from '@/src/lib/utils'
import Pagination, { type PaginationProps } from '@components/pagination'
import { Table as ShadeTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { type Table, flexRender } from '@tanstack/react-table'
import { useScroll, useSize } from 'ahooks'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import NoData from './components/NoData'
import type { AlignInfo, PinnerInfo, SizeInfo } from './interface'
import { formatSize, getCommonPinningStyles } from './utils'

interface IProps {
  table: Table<any>
  // null 不显示分页
  pagination: PaginationProps | null
  loading?: boolean
  error?: any
  pinnerInfo?: PinnerInfo
  sizeInfo?: SizeInfo
  alignInfo?: AlignInfo
  stickyHeaderInfo?: {
    // y 方向滚动监听的元素， id | element | target, 不传 默认 window
    scrollYTarget?: Element | Document | (() => Element) | MutableRefObject<Element>
    /**
     * 固定到顶部的值
     */
    top?: number
  } | null
}

// console.log('document----------', document.querySelector('#yq_children_wrap'))
const InternalTable: React.FC<IProps> = ({
  table,
  pagination,
  loading,
  pinnerInfo,
  sizeInfo,
  stickyHeaderInfo = {},
  alignInfo = {}
}) => {
  console.log('loading--', loading)
  // 是否固定表格头
  const isStickyHeader = stickyHeaderInfo !== null
  const columnsLength = table.getAllColumns().length
  const tableBodyRef = useRef(null)
  const headerTopRef = useRef(null)
  const headerBottomRef = useRef(null)
  const scrollTableX = useScroll(tableBodyRef)
  const tableSize = useSize(tableBodyRef)
  const scrollY = useScroll(
    typeof stickyHeaderInfo?.scrollYTarget === 'string'
      ? document.getElementById(stickyHeaderInfo?.scrollYTarget)
      : stickyHeaderInfo?.scrollYTarget,
    () => {
      if (!isStickyHeader) {
        return false
      }
      return true
    }
  )
  console.log(scrollY, '--------------+=====', tableSize)

  const [isTop, setIsTop] = useState(false)
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
  // const sizeStyle = useMemo(() => {
  //   const sizeData: Record<string, ReturnType<typeof formatSize>> = {}
  //   table.getHeaderGroups().forEach((headerGroup) => {
  //     headerGroup.headers.forEach((header) => {
  //       sizeData[header.id] = formatSize(header, sizeInfo)
  //     })
  //   })
  //   return sizeData
  // }, [table, sizeInfo])
  console.log('scrollTableX', scrollTableX)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('headerTopRef-在视口内', entry)
          setIsTop(false)
        } else {
          setIsTop(true)
          console.log('headerTopRef-在视口外----')
        }
      },
      {
        threshold: 0.01
      }
    )

    if (headerTopRef.current) {
      observer.observe(headerTopRef.current)
    }

    return () => {
      if (headerTopRef.current) {
        observer.unobserve(headerTopRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('headerBottomRef-在视口内', entry)
        } else {
          console.log('headerBottomRef-在视口外----')
        }
      },
      {
        threshold: 0.01
      }
    )

    if (headerBottomRef.current) {
      observer.observe(headerBottomRef.current)
    }

    return () => {
      if (headerBottomRef.current) {
        observer.unobserve(headerBottomRef.current)
      }
    }
  }, [])

  console.log('isTop---', isTop)
  return (
    <>
      {/* sticky */}
      <ShadeTable>
        <div className="w-full overflow-hidden relative">
          <TableHeader
            style={{ width: `${tableSize?.width}px` }}
            className={cn(isTop ? 'fixed top-[64px] overflow-hidden text-secondary' : 'hidden', 'z-20')}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow style={{ left: `-${scrollTableX?.left}px` }} className="relative" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // console.log('(header.column)', getCommonPinningStyles(header.column))
                  const { style, className } = getCommonPinningStyles(header.column)
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...formatSize(header, sizeInfo),
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
        </div>
      </ShadeTable>
      <div style={{ width: '1px' }} ref={headerTopRef}></div>
      <ShadeTable ref={tableBodyRef}>
        <TableHeader className="text-secondary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // console.log('(header.column)', getCommonPinningStyles(header.column))
                const { style, className } = getCommonPinningStyles(header.column)
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...formatSize(header, sizeInfo),
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
        <div style={{ width: '1px' }} ref={headerBottomRef}></div>
        <TableBody>
          {table.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="group" key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => {
                  const { style, className } = getCommonPinningStyles(cell.column)
                  return (
                    // console.log('cell.id', cell.column.id, alignInfo[cell.id])
                    <TableCell
                      key={cell.id}
                      style={{ textAlign: alignInfo[cell.column.id], ...style }}
                      // TODO: 行样式处理
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
      {/* position: sticky; bottom: 0 */}
      {pagination !== null && <Pagination {...pagination} />}
    </>
  )
}

export default InternalTable
