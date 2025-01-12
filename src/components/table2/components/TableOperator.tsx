import { cn } from '@src/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { useSize } from 'ahooks'
import { ChevronDown } from 'lucide-react'
import { FC, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@components/ui/button'
import { AutoOperatorInfo, OperatorButtonItem, TableProps } from '../interface'
import CheckHeader from './CheckHeader'

interface TableOperatorProps extends Pick<TableProps, 'operatorInfo' | 'table'> {
  tableBodyRef: React.MutableRefObject<any>
}

const TableOperator: FC<TableOperatorProps> = ({ table, operatorInfo, tableBodyRef }) => {
  const tableSize = useSize(tableBodyRef)
  const ref = useRef<HTMLDivElement>(null)
  const [isTop, setIsTop] = useState(false)

  const operatorIsElement = isValidElement(operatorInfo)

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

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const isChecked = table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()

  const [leftList, collapsedList] = useMemo(() => {
    if (!operatorInfo || isValidElement(operatorInfo)) {
      return []
    }
    const { operatorList, overEllipseCount } = operatorInfo as AutoOperatorInfo
    if (!operatorList) {
      return []
    }
    return [operatorList.slice(0, overEllipseCount), operatorList.slice(overEllipseCount)]
  }, [operatorInfo])

  return (
    <>
      <div ref={ref} className="relative">
        {isChecked && (
          <div
            style={{ width: `${tableSize?.width}px` }}
            className={cn('bg-white z-20 h-12 px-4', isTop ? 'fixed top-[64px]' : 'absolute top-0')}
          >
            {operatorIsElement ? (
              operatorInfo
            ) : (
              <div className="flex items-center h-full">
                <CheckHeader table={table} />
                <span className="px-8">{table.getFilteredSelectedRowModel().rows.length} selected</span>
                <div className="flex gap-2 items-center h-full">
                  {leftList?.map((item) => {
                    if (isValidElement(item.elementType)) {
                      return item.elementType
                    }
                    const { id, onClick, title, ...restProps } = item as OperatorButtonItem
                    return (
                      <Button
                        key={id}
                        onClick={() => {
                          if (onClick) {
                            console.log('clic-----')
                          }
                        }}
                        variant="outline"
                        size="sm"
                        {...restProps}
                      >
                        {title}
                      </Button>
                    )
                  })}
                  {!!collapsedList?.length && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="outline" size="sm">
                          More actions <ChevronDown />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white w-full">
                        {collapsedList.map((item) => {
                          if (isValidElement(item.elementType)) {
                            return item.elementType
                          }
                          const { id, onClick, disabled, title, icon } = item as OperatorButtonItem

                          return (
                            <DropdownMenuItem
                              onClick={() => {
                                if (onClick) {
                                  console.log('drop---click')
                                }
                              }}
                              disabled={disabled}
                              key={id}
                            >
                              {icon}
                              {title}
                            </DropdownMenuItem>
                          )
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default TableOperator
