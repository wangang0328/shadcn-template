import { useMemo } from "react"
import {
  PaginationWrapper,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PageSizeSelect,
  QuickJumper,
  PageTotalInfo
} from "./Components"
import { useControllableValue, useMemoizedFn } from 'ahooks'
import { renderCountNumList } from "./utils"

export interface PaginationProps {
  /**
   * 当前页, 从 0 开始 为和 react-table 保持一致
   */
  pageIndex?: number
  pageSize?: number
  /**
   * 是否显示快速跳转，默认 是
   */
  showQuickJumper?: boolean
  /**
   * 显示总数信息，默认 true
   */
  showTotal?: boolean
  // 总页数，默认 0
  total?: number
  /**
   * pageSize 选项， 默认 [10, 20, 50, 100, 200]
   */
  pageSizeOptions?: number[] | null
  /**
   * 简单模式，只显示左右切换分页, 默认 fasle
   */
  simple?: boolean
  disabled?: boolean
  // 默认 0
  defaultpageIndex?: number
  // 默认10
  defaultPageSize?: number
  /**
   * 当前页左右超过几个时，显示省略号，默认 两个
   */
  overCollapseCount?: number
  /**
   *  只有一页时，是否隐藏页码，默认 true
   */
  hideOnSinglePage?: boolean
  onChange?: (pageIndex: number, pageSize: number) => void
  onpageIndexChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

const defaultPageSizeOptions = [10, 20, 50, 100, 200]

/**
 * 分页，可结合 ahooks 的 usePagination 使用
 */
const Pagination: React.FC<PaginationProps> = (props) => {
  const { total = 0, simple = false, disabled, onChange, overCollapseCount = 2, hideOnSinglePage = true, pageSizeOptions = defaultPageSizeOptions, showTotal = true, showQuickJumper = true } = props
  // 自己管理状态，也可以是受控状态
  const [pageIndex, setpageIndex] = useControllableValue(props, { defaultValuePropName: 'defaultpageIndex', valuePropName: 'pageIndex', trigger: 'onpageIndexChange', defaultValue: 0 })
  const [pageSize, setPageSize] = useControllableValue(props, { defaultValuePropName: 'defaultPageSize', valuePropName: 'pageSize', trigger: 'onPageSizeChange', defaultValue: 10 })

  console.log('pageIndex,pageSize', pageIndex, pageSize)
  // 总页数
  const totalPageCount = useMemo(() => {
    if (pageSize <= 0) {
      console.error('pageSize illegal:', pageSize)
    }
    return Math.ceil(total / pageSize) || 0
  }, [total, pageSize])

  // pageIndex 改变
  const handlepageIndexChange = useMemoizedFn((val) => {
    let target = val
    if (val < 0) {
      target = 0
    }
    if (val >= totalPageCount - 1) {
      target = totalPageCount - 1
    }
    setpageIndex(target)
    onChange?.(target, pageSize)
  })
  
  // pageSize 改变
  const handlePageSizeChange = useMemoizedFn((val) => {
    setPageSize(val)
    setpageIndex(0)
    onChange?.(0, val)
})

  const numPageList = useMemo(() =>  renderCountNumList({
      pageIndex,
      totalPageCount,
      simple,
      overCollapseCount,
      hideOnSinglePage
    })
  , [pageIndex, totalPageCount, simple, overCollapseCount, hideOnSinglePage])

  if (hideOnSinglePage && totalPageCount <= 1) {
    // 单页隐藏
    return null
  }

  return (
    <PaginationWrapper>
      <PaginationContent>
        {/* 总页码信息 */}
        {(showTotal && !simple) && <PaginationItem key="totalInfo">
          <PageTotalInfo total={total} pageIndex={pageIndex} pageSize={pageSize} />
        </PaginationItem>}
       {(!!pageSizeOptions && !simple) && <PaginationItem>
          <PageSizeSelect options={pageSizeOptions} onChange={handlePageSizeChange} disabled={disabled} value={pageSize} />
        </PaginationItem>}
        {/* 后退页面 */}
        <PaginationItem key="previous">
          <PaginationPrevious disabled={disabled || pageIndex === 0} onClick={() => handlepageIndexChange(pageIndex - 1)} />
        </PaginationItem>
        {
          numPageList.map((item, index) =>  (
            <PaginationItem key={index}>
              {item === -1 ? <PaginationEllipsis /> : <PaginationLink onClick={() => handlepageIndexChange(item)} isActive={pageIndex === item} disabled={disabled}>{item + 1}</PaginationLink>}
            </PaginationItem>
          )
          )
        }
        {/* 前进页面 */}
        <PaginationItem key="nex">
          <PaginationNext disabled={disabled || pageIndex === totalPageCount - 1} onClick={() => handlepageIndexChange(pageIndex + 1)} />
        </PaginationItem>
        {/* 快速跳转 */}
        {(showQuickJumper && !simple) && <PaginationItem>
          <QuickJumper onChange={handlepageIndexChange} disabled={disabled} />
        </PaginationItem>}
      </PaginationContent>
  </PaginationWrapper>
  )
}

export default Pagination
