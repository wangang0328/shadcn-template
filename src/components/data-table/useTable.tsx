import {
  type ColumnFiltersState,
  type SortingState,
  type TableOptions,
  type TableState,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getCoreRowModel
} from '@tanstack/react-table'

import { useControllableValue, useMemoizedFn, useRequest } from "ahooks"
import { Options } from 'ahooks/lib/useRequest/src/types'
import { isNil, isUndefined, merge, pick } from 'lodash-es'
import { useEffect, useMemo } from 'react'


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

type ServiceType = (param: ServiceParams) => Promise<any>


// interface ITableState extends TableState {
//   // TODO: 其他参数
//   pagination: {
//     // pageCount?: number
//     pageIndex?: number
//     pageSize?: number
//   }
// }

interface ITableOptions<TData = any> extends Omit<TableOptions<TData>, 'pageCount' | 'data'> {
  // state: Partial<ITableState>
  requestOptions?: Options<any, any>
  defaultParams?: Partial<TableState>
  rowKey?: string
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
  const { columns, requestOptions, defaultParams, state, rowKey, ...restProps } = options
  // 默认参数
  const targetDefaultParams = merge(defaultData, defaultParams)
  // 对 table 的相关状态进行管理
  // sorting 排序
  const [sorting, setSorting] = useControllableValue(state, { valuePropName: 'sorting', trigger: 'onSortingChange', defaultValue: targetDefaultParams.sorting })
  // visibility 隐藏列
  // const [columnVisibility, setColumnVisibility] = useControllableValue(state, { valuePropName: 'columnVisibility', trigger: 'onColumnVisibilityChange', defaultValue: targetDefaultParams.columnVisibility })
  const [rowSelection, setRowSelection] = useControllableValue(state, { valuePropName: 'rowSelection', trigger: 'onRowSelectionChange', defaultValue: targetDefaultParams.rowSelection })
  const [columnFilters, setColumnFilters] = useControllableValue(state, { valuePropName: 'columnFilters', trigger: 'onColumnFiltersChange',defaultValue: targetDefaultParams.columnFilters })
  const [pagination, setPagination] = useControllableValue(state, { valuePropName: 'paginaion', trigger: 'onPaginationChange',defaultValue: targetDefaultParams.pagination })

  const { data, run, loading, error } = useRequest(service, { defaultParams: {
    sorting,
    columnFilters,
    pagination
  }, ...requestOptions } )

  // 处理在colums自定义的一些属性
  const { targetColumns, pinnerInfo, sizeInfo, alignInfo } = useMemo(() => {
    // 固定列
    const pinner = {}
    // 尺寸信息，
    const size = {}
    // 居中
    const alignInfo = {}
  
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
    })
    return {
      targetColumns,
      pinnerInfo: pinner,
      sizeInfo: size,
      alignInfo
    }
  }, [columns])

  const handleChange = (type: 'columnFilters' | 'sorting' | 'pagination', setStateFn) => {
    return (v: any) => {
      const targetParams = {
        columnFilters,
        pagination,
        sorting
      }
      console.log('change------------------------------', type)
      if (['sorting', 'columnFilters'].includes(type)) {
        const targetPagination = { ...pagination, pageIndex: 1 }
        targetParams.pagination = targetPagination
        // 排序和筛选改变，需要重置页码索引
        setPagination(targetPagination)
      }
      const targetState = typeof v === 'function' ? v(targetParams[type]) : v
      setStateFn(targetState)
      // TODO: onChange
      // TODO: run
      // 请求数据
      run({ ...targetParams, [type]: targetState })
    }
  }
  
  const pageCount = useMemo(() => {
    if (!data?.page) {
      return undefined
    }
    const { total, pageSize } = data.page
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
    getRowId: (row, index) => isNil(rowKey) ? index : row[rowKey],
    ...restProps,
    // 顺序不能改变，已经对state 部分值进行可受控管理
    data: data?.data ?? defaultTableData,
    pageCount,
    state: {
      ...options.state,
      sorting,
      rowSelection,
      columnFilters,
      pagination,
      // columnVisibility,
    },
    // 必须加，不然死循环了，会一直调用 onPaginationChange, filter 和 sorting 同理
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleChange('sorting', setSorting),
    onColumnFiltersChange: handleChange('columnFilters', setColumnFilters),
    onPaginationChange: handleChange('pagination', setPagination),
    // onColumnVisibilityChange: setColumnVisibility,
  })


  console.log('pagination------', table.getState().pagination, pagination)

  // TODO: 固定列处理

  return {
    table,
    tableProps: {
      table,
      loading,
      error,
      pagination: {
        ...pagination,
        total: data?.page?.total ?? 0,
        onChange: (pageIndex: number, pageSize: number) => {
          table.setPagination({pageIndex, pageSize})
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
