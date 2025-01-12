// import { Table as ShadeTable, TableHead, TableHeader, TableRow } from '@components/ui/table'
import { cn } from '@src/lib/utils'
import { TableHead, TableHeader, TableRow } from '@components/ui/table'
import { flexRender } from '@tanstack/react-table'
import { useScroll, useSize, useThrottle } from 'ahooks'
import { FC, useEffect, useRef, useState } from 'react'
import { TableProps } from '../interface'
import { getCommonPinningStyles } from '../utils'
import InternalColGroup from './InternalColGroup'

interface InternalStickyProps extends Pick<TableProps, 'alignInfo' | 'table' | 'stickyHeaderInfo'> {
  sizeStyle: Record<
    string,
    { width: string | undefined; minWidth: string | undefined; maxWidth: string | undefined } | null
  >
  tableBodyRef: React.MutableRefObject<any>
}

const useThrottleScroll = (tableBodyRef: any) => {
  const scrollTableX = useScroll(tableBodyRef)
  const throttledValue = useThrottle(scrollTableX, { wait: 50 })
  console.log('throttledValue---', throttledValue)
  return throttledValue
}

const InternalSticky: FC<InternalStickyProps> = ({ alignInfo, sizeStyle, tableBodyRef, table, stickyHeaderInfo }) => {
  const headerTopRef = useRef(null)
  const scrollTableX = useThrottleScroll(tableBodyRef)
  const tableSize = useSize(tableBodyRef)
  console.log('--------------+=====', stickyHeaderInfo)

  const [isTop, setIsTop] = useState(false)
  console.log(JSON.stringify(scroll), 'JSON.stringify(scroll)')

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

  return (
    <>
      <div
        className={cn('overflow-hidden z-10', isTop ? 'fixed top-[64px]' : 'hidden')}
        style={{ width: `${tableSize?.width}px`, overflow: 'hidden' }}
      >
        <table className="w-full caption-bottom text-sm">
          <InternalColGroup table={table} />
          <TableHeader style={{ left: `-${scrollTableX?.left}px` }} className="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { style, className } = getCommonPinningStyles(header.column)
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...sizeStyle?.[header.id],
                        textAlign: alignInfo?.[header.id],
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
        </table>
      </div>
      <div style={{ width: '100%' }} ref={headerTopRef}></div>
    </>
  )
}

export default InternalSticky
