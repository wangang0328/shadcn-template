import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type SortingState,
  type TableOptions,
  type TableState,
  useReactTable
} from '@tanstack/react-table'

import { useControllableValue, useRequest } from 'ahooks'
import { Options } from 'ahooks/lib/useRequest/src/types'
import { isNil, isUndefined, merge } from 'lodash-es'
import { useMemo } from 'react'
import { AlignType, ColumnByUseTableType, PinnerType } from './interface'
/**
 * 请求service的参数
 */
interface ServiceParams {
  pagination: {
    pageIndex?: number
    pageSize?: number
    pageCount?: number
  }
  sorting: SortingState
  // 搜索参数
  columnFilters: ColumnFiltersState
}

type ResData = { data: any; pagination?: { total: number; pageSize: number } }
type ServiceType = (param: ServiceParams) => Promise<ResData>

interface ITableOptions<TData = any> extends Omit<TableOptions<TData>, 'pageCount' | 'data' | 'columns'> {
  // state: Partial<ITableState>
  requestOptions?: Options<any, any>
  defaultParams?: Partial<TableState>
  rowKey?: string
  columns: Array<ColumnByUseTableType>
  onChange?: (params: ServiceParams) => void
}

// 默认值
const defaultData: Partial<TableState> = {
  sorting: [],
  columnVisibility: {},
  rowSelection: {},
  columnFilters: [],
  pagination: {
    pageIndex: 0,
    pageSize: 20
  }
}

const defaultTableData: any[] = []

const useTable = (service: ServiceType, options: Partial<ITableOptions> = {}) => {
  const { columns, requestOptions, defaultParams, state, rowKey, onChange, ...restProps } = options
  // 默认参数
  const targetDefaultParams = merge(defaultData, defaultParams)
  // 对 table 的相关状态进行管理
  // sorting 排序
  const [sorting, setSorting] = useControllableValue(state, {
    valuePropName: 'sorting',
    trigger: 'onSortingChange',
    defaultValue: targetDefaultParams.sorting
  })
  const [rowSelection, setRowSelection] = useControllableValue(state, {
    valuePropName: 'rowSelection',
    trigger: 'onRowSelectionChange',
    defaultValue: targetDefaultParams.rowSelection
  })
  const [columnFilters, setColumnFilters] = useControllableValue(state, {
    valuePropName: 'columnFilters',
    trigger: 'onColumnFiltersChange',
    defaultValue: targetDefaultParams.columnFilters
  })
  const [pagination, setPagination] = useControllableValue(state, {
    valuePropName: 'pagination',
    trigger: 'onPaginationChange',
    defaultValue: targetDefaultParams.pagination
  })
  // visibility 隐藏列
  // const [columnVisibility, setColumnVisibility] = useControllableValue(state, { valuePropName: 'columnVisibility', trigger: 'onColumnVisibilityChange', defaultValue: targetDefaultParams.columnVisibility })

  const { data, run, loading, error } = useRequest<ResData, any>(service, {
    defaultParams: {
      sorting,
      columnFilters,
      pagination
    },
    ...requestOptions
  })

  // 处理在colums自定义的一些属性
  const { targetColumns, pinnerInfo, sizeInfo, alignInfo } = useMemo(() => {
    // 固定列
    const pinner: Record<string, PinnerType> = {}
    // 尺寸信息，
    const size: Record<string, { maxSize?: number; minSize?: number }> = {}
    // 对齐方式
    const alignInfo: Record<string, AlignType> = {}

    const targetColumns = columns?.map(({ pinnerType, accessorKey, minSize, maxSize, align, ...restData }) => {
      // 代码优化
      if (pinnerType) {
        pinner[accessorKey] = pinnerType
      }
      if (!isUndefined(minSize) || !isUndefined(maxSize)) {
        size[accessorKey] = {
          minSize,
          maxSize
        }
      }
      if (!isNil(align)) {
        alignInfo[accessorKey] = align
      }
      return {
        accessorKey,
        ...restData
      }
    }) as ColumnDef<any>[]
    return {
      targetColumns,
      pinnerInfo: pinner,
      sizeInfo: size,
      alignInfo
    }
  }, [columns])

  // TODO: filter 单独抽离出来， 因为触发搜索的条件可能不一样，需要在外部手动触发
  // 返回一个函数，重置页码为1
  const handleChange =
    (
      type: 'columnFilters' | 'sorting' | 'pagination',
      setStateFn: (v: React.SetStateAction<any>, ...args: any[]) => void
    ) =>
    (v: React.SetStateAction<any>) => {
      const targetParams = {
        columnFilters,
        pagination,
        sorting
      }
      if (['sorting', 'columnFilters'].includes(type)) {
        // 排序和筛选改变，需要重置页码索引
        const targetPagination = { ...pagination, pageIndex: 1 }
        targetParams.pagination = targetPagination
        setPagination(targetPagination)
      }
      const targetState = typeof v === 'function' ? v(targetParams[type]) : v
      setStateFn(targetState)
      onChange?.(targetState)
      // 请求数据，调用service
      run({ ...targetParams, [type]: targetState })
    }

  const pageCount = useMemo(() => {
    if (!data?.pagination) {
      return undefined
    }
    const { total, pageSize } = data.pagination
    if (!isNil(total) && !isNil(pageSize)) {
      return Math.ceil(total / pageSize)
    }
    return undefined
  }, [data])

  const table = useReactTable({
    columns: targetColumns,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row, index) => (isNil(rowKey) ? index : row[rowKey]),
    ...restProps,
    // 顺序不能改变，已经对state 部分值进行可受控管理
    data: data?.data ?? defaultTableData,
    pageCount,
    state: {
      ...options.state,
      sorting,
      rowSelection,
      columnFilters,
      pagination
      // columnVisibility,
    },
    // 必须加，不然死循环了，会一直调用 onPaginationChange, filter 和 sorting 同理
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleChange('sorting', setSorting),
    onColumnFiltersChange: handleChange('columnFilters', setColumnFilters),
    onPaginationChange: handleChange('pagination', setPagination)
    // onColumnVisibilityChange: setColumnVisibility,
  })

  console.log('pagination------', table.getState().pagination, pagination)

  return {
    table,
    tableProps: {
      table,
      loading,
      error,
      pagination: {
        ...pagination,
        total: data?.pagination?.total ?? 0,
        onChange: (pageIndex: number, pageSize: number) => {
          table.setPagination({ pageIndex, pageSize })
        }
      },
      pinnerInfo,
      sizeInfo,
      alignInfo
    },
    search: {
      run,
      error,
      loading
    }
  }
}

export default useTable
