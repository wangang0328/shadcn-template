'use client'

import { Checkbox } from '@components/ui/checkbox'

import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer } from 'lucide-react'
import DataTableColumnHeader from '../components/SortHeader'
import type { ColumnByUseTableType } from '../interface'
// import { DataTableRowActions } from './data-table-row-actions'

// const labels = [
//   {
//     value: 'bug',
//     label: 'Bug'
//   },
//   {
//     value: 'feature',
//     label: 'Feature'
//   },
//   {
//     value: 'documentation',
//     label: 'Documentation'
//   }
// ]

const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDown
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRight
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUp
  }
]

const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: HelpCircle
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: Circle
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: Timer
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircle
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CircleOff
  }
]

export const columns: Array<ColumnByUseTableType> = [
  {
    accessorKey: 'select',
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    pinnerType: 'left',
    // minSize: 300,
    align: 'left',
    size: 60
    // @ts-ignore
    // pinningType: 'left'
    // align: 'left' | 'right'
    // 多选框
    // type: 'selection' 'normal'
    // 固定列,
    // pinningType: 'left' | 'right'
    // 固定表头， 在table属性里去加
    // 排序 和头部有关，加参数 ?
    //
    // 固定行
  },
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task" />,
    cell: ({ row }) => <div className="w-[100px]">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
    minSize: 300
  },
  {
    accessorKey: 'title',
    minSize: 300
    // header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />
    // cell: ({ row }) => {
    //   const label = labels.find((label) => label.value === row.original.label)

    //   return (
    //     <div className="flex space-x-2">
    //       {label && <Badge variant="outline">{label.label}</Badge>}
    //       <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
    //     </div>
    //   )
    // }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'))

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
    minSize: 300
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = priorities.find((priority: any) => priority.value === row.getValue('priority'))

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'actions',
    cell: () => '...'
    // cell: ({ row }) => <DataTableRowActions row={row} />
  }
]

export const operatorInfo: any = {
  overEllipseCount: 5,
  operatorList: [
    {
      type: 'Button',
      title: 'button1'
    },
    {
      type: 'Button',
      title: 'button2'
    },
    {
      type: 'Button',
      title: 'button3'
    },
    {
      type: 'Button',
      title: 'button4'
    },
    {
      type: 'Button',
      title: 'button5'
    },
    {
      type: 'Button',
      title: 'button6'
    },
    {
      type: 'Button',
      title: 'button7'
    },
    {
      type: 'Button',
      title: 'button8'
    }
  ]
}
