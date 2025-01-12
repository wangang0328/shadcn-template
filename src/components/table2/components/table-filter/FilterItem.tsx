import { useTableContext } from "../../TableContext"

const FilterItem = ({ child }) => {
  const { table } = useTableContext()
  if (!table) {
    console.error("在 table 使用 filterIem")
    return null
  }
  
}

export default FilterItem
