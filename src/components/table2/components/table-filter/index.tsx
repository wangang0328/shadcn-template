import { isUndefined } from 'lodash-es'
import React from 'react'
import { useTableContext } from '../../TableContext'
import { Column } from '@tanstack/react-table'

// TODO: 规则校验 ？
interface FilterItemProps {
  id: string
  label: string
  /**
   * 取value值的key 默认 value
   **/
  valueKey?: string
  /**
   * 监听修改的key，默认 onChange
   */
  onChangeKey?: string
  /**
   * onChange获取值的路径 eg: .a.b.e, 直接取 onChange的值 - '.'
   */
  getValuePath?: string
  [key: string]: any
}

interface InternalFilterItemProps {
  column: Column<any>
  id: string
  label: string
  /**
   * 取value值的key 默认 value
   **/
  valueKey?: string
  /**
   * 监听修改的key，默认 onChange
   */
  onChangeKey?: string
  /**
   * onChange获取值的路径 eg: .a.b.e, 直接取 onChange的值 - '.'
   */
  getValuePath?: string
  [key: string]: any
}

interface ChildPorps {
  [key: string]: any
}

class InternalFilterItem extends React.Component<InternalFilterItemProps> {
  private isMouted = false

  componentDidMount() {
    this.isMouted = true
    const { column, defaultValue } = this.props
    // 初始值 undefined
    column.setFilterValue(defaultValue)
  }

  public reRender = () => {
    if (this.isMouted) {
      this.forceUpdate()
    }
  }

  public getControlled = (props: ChildPorps = {}) => {
    const {
      column,
      valueKey = 'value',
      onChangeKey = 'onChange',
      getValuePath,
    } = this.props

    return {
      [valueKey]: column.getFilterValue(),
      [onChangeKey]: (value: any) => {
        let newValue

        // 获取值的方法
        const pathList = getValuePath?.split('.').filter(Boolean)
        if (pathList) {
          // debugger
          newValue = pathList.reduce((acc, key) => {
            return acc[key]
          }, value)
        } else {
          // 取值
          newValue = isUndefined(value.target?.value) ? undefined : value.target.value
          if (isUndefined(value.target) && !isUndefined(value)) {
            newValue = value
          }
        }
        column.setFilterValue(newValue)
      },
      ...props,
    }
  }

  public render() {
    const { children } = this.props
    if (!children) {
      // 如果没有children或者没有name，那么就没必要受控
      return children
    }
    return React.cloneElement(children, this.getControlled(children.props))
  }
}

const FilterItem: React.FC<FilterItemProps> = ({ table, id, ...restProps }) => {
  // const { table } = useTableContext()
  if (!table) {
    console.error('use in table')
    return null
  }
  // table?.getFilteredRowModel().rows
  const column = table.getColumn(id)
  if (!column) {
    console.error('column not found')
    return null
  }
  return (
    <InternalFilterItem
      column={column}
      key={id}
      id={id}
      {...restProps}
    />
  )
}

export default FilterItem
