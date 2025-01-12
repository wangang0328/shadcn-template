import { type Table } from '@tanstack/react-table'
import { memo } from 'react'

const InternalColGroup = ({ table }: { table: Table<any> }) => (
  <>
    {table.getHeaderGroups().map((headerGroup) => (
      <colgroup key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <col key={header.id} style={{ width: '1px' }} />
        ))}
      </colgroup>
    ))}
  </>
)

export default memo(InternalColGroup)
