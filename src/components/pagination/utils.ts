import { concat } from "lodash-es"

/**
 * 最小边界值
 */
const minCountBoundary = 0
/**
 * 填充page no
 * 连续页码的最小值和最大值 与 页码的边界值做比较，差值 为 0 不填充，差值为1 填充边界值，差值大于 1 填充边界值和省略号
 */
const fillingCount = (boundaryCount: number, count: number, type: 'min' | 'max') => {
  const differCount = Math.abs(boundaryCount - count)
  if (differCount === 0) {
    return []
  }
  if (differCount === 1) {
    return [boundaryCount]
  }
  // 差值超过 1，需要填充 省略号, -1 表示 需要填充 省略号
  return type === 'min' ? [boundaryCount, -1] : [-1, boundaryCount]
}

export const renderCountNumList = ({
  pageIndex,
  overCollapseCount,
  totalPageCount,
  simple,
  hideOnSinglePage
}: {
  pageIndex: number
  overCollapseCount: number
  totalPageCount: number
  simple: boolean
  hideOnSinglePage: boolean
}) => {
  if (simple || (hideOnSinglePage && totalPageCount <= 1)) {
    // 简单分页，只有一页隐藏
    return []
  }
  // 当前页到 左右两侧连续的页码值，eg: pageIndex=5, overCollapseCount = 2, minpageIndex 3， maxpageIndex 7, 那么显示的页码就是3，4，5，6，7
  const tempMinpageIndex = pageIndex - overCollapseCount
  const tempMaxpageIndex = pageIndex + overCollapseCount
  const minpageIndex = tempMinpageIndex <= minCountBoundary ? minCountBoundary : tempMinpageIndex
  const maxpageIndex = tempMaxpageIndex >= totalPageCount ? (totalPageCount - 1) : tempMaxpageIndex
  const minPageList = fillingCount(minCountBoundary, minpageIndex, 'min')
  const maxPageList = fillingCount(totalPageCount - 1, maxpageIndex, 'max')
  const continuousList = []
  for (let i = minpageIndex; i <= maxpageIndex; i ++) {
    continuousList.push(i)
  }
  return concat(minPageList, continuousList, maxPageList)
}