import { concat } from "lodash-es"

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
  pageNo,
  overCollapseCount,
  totalPageCount,
  simple,
  hideOnSinglePage
}: {
  pageNo: number
  overCollapseCount: number
  totalPageCount: number
  simple: boolean
  hideOnSinglePage: boolean
}) => {
  if (simple || (hideOnSinglePage && totalPageCount <= 1)) {
    // 简单分页，只有一页隐藏
    return []
  }
  // 当前页到 左右两侧连续的页码值，eg: pageNo=5, overCollapseCount = 2, minPageNo 3， maxPageNo 7, 那么显示的页码就是3，4，5，6，7
  const tempMinPageNo = pageNo - overCollapseCount
  const tempMaxPageNo = pageNo + overCollapseCount
  const minPageNo = tempMinPageNo <= 1 ? 1 : tempMinPageNo
  const maxPageNo = tempMaxPageNo >= totalPageCount ? totalPageCount : tempMaxPageNo
  const minPageList = fillingCount(1, minPageNo, 'min')
  const maxPageList = fillingCount(totalPageCount, maxPageNo, 'max')
  const continuousList = []
  for (let i = minPageNo; i <= maxPageNo; i ++) {
    continuousList.push(i)
  }
  return concat(minPageList, continuousList, maxPageList)
}