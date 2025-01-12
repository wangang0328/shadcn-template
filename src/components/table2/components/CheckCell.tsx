import { Checkbox } from '@components/ui/checkbox'
import { type Table } from '@tanstack/react-table'
import { FC } from 'react'

interface CheckCellProps {
  table: Table<any>
}

const CheckCell: FC<CheckCellProps> = ({ table }) => (
  <Checkbox
    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    className="translate-y-[2px]"
  />
)

export default CheckCell
