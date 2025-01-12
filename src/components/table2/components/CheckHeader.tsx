import { Checkbox } from '@components/ui/checkbox'
import { type Table } from '@tanstack/react-table'
import { FC } from 'react'

interface CheckHeaderProps {
  table: Table<any>
}

const CheckHeader: FC<CheckHeaderProps> = ({ table }) => (
  <Checkbox
    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    className="translate-y-[2px]"
  />
)

export default CheckHeader
