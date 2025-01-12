import { Column, type Header } from '@tanstack/react-table'
import { isUndefined } from 'lodash-es'
import { CSSProperties } from 'react'
import { SizeInfo } from './interface'

export const sizeFormat = (v?: number) => {
  if (isUndefined(v)) {
    return undefined
  }
  return `${v}px`
}

/**
 * 列的尺寸处理
 */
export const formatSize = (header: Header<any, any>, sizeInfo?: SizeInfo) => {
  if (!sizeInfo) {
    return null
  }
  return {
    width: sizeFormat(header.getSize()),
    minWidth: sizeFormat(sizeInfo[header.id]?.minSize),
    maxWidth: sizeFormat(sizeInfo[header.id]?.maxSize)
  }
}

// 固定列
export const getCommonPinningStyles = (column: Column<any>): { style: CSSProperties; className: string } => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')
  let boxShadowClassName = ''
  console.log('isLastLeftPinnedColumn', isLastLeftPinnedColumn)
  if (isLastLeftPinnedColumn) {
    // 左侧最后一个元素
    boxShadowClassName =
      "before:content-[''] before:absolute before:w-1 before:h-full before:absolute before:top-0 before:right-0 before:shadow-[4px_0px_4px_-4px_inset_rgba(0,0,0,0.3)]"
  }
  if (isFirstRightPinnedColumn) {
    boxShadowClassName =
      "before:content-[''] before:absolute before:w-1 before:h-full before:absolute before:top-0 before:left-0 before:shadow-[-4px_0px_4px_-4px_inset_rgba(0,0,0,0.3)]"
  }
  return {
    style: {
      // boxShadow: isLastLeftPinnedColumn
      //   ? '-4px 0 4px -4px gray inset'
      //   : isFirstRightPinnedColumn
      //     ? '4px 0 4px -4px gray inset'
      //     : undefined,
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: 1,
      position: isPinned ? 'sticky' : 'relative',
      // width: sizeFormat(column.getSize()),
      zIndex: isPinned ? 1 : 0
    },
    className: boxShadowClassName
  }
}
