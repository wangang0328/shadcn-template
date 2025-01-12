import { type PaginationProps } from '@components/pagination'
import type { ColumnDef, Table } from '@tanstack/react-table'
import { ReactElement } from 'react'
import { ButtonProps } from '../ui/button'

export type PinnerType = 'left' | 'right'

export type AlignType = 'left' | 'right' | 'center'

export type PinnerInfo = Record<string, PinnerType>

export type SizeInfo = Record<string, { maxSize?: number; minSize?: number }>

export type AlignInfo = Record<string, AlignType>

export type InternalColumnDef = {
  /**
   * 固定列，左 / 右
   */
  pinnerType?: PinnerType
  /**
   * 列靠 左/右/中心居中对齐
   */
  align?: AlignType
  accessorKey: string
}

export type ColumnByUseTableType = ColumnDef<any> & InternalColumnDef

export interface OperatorButtonItem extends Omit<ButtonProps, 'children'> {
  id: string
  elementType: 'button'
  icon?: ReactElement
  title: string
  onClick?: (ids: any) => void
}

interface OperatorElementItem {
  elementType: ReactElement
}

export interface AutoOperatorInfo {
  overEllipseCount?: number
  operatorList?: Array<OperatorButtonItem | OperatorElementItem>
}

export interface TableProps {
  table: Table<any>
  // null 不显示分页
  pagination: PaginationProps | null
  loading?: boolean
  error?: any
  pinnerInfo?: PinnerInfo
  sizeInfo?: SizeInfo
  alignInfo?: AlignInfo
  operatorInfo?: AutoOperatorInfo | ReactElement
  stickyHeaderInfo?: {
    /**
     * 固定到顶部的值
     */
    top?: number
  } | null
  filters: any
}
