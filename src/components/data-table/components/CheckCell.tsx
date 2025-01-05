import { type Row } from "@tanstack/react-table"
import { FC } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface CheckCellProps {
  row: Row<any>,
}

const CheckCell: FC<CheckCellProps> = ({ row }) => {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      className="translate-y-[2px]"
    />
  )
}

export default CheckCell
