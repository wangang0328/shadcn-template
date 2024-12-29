import { useMemoizedFn, useUpdate } from "ahooks"
import { isFunction } from "lodash-es"
import { SetStateAction, useMemo, useRef } from "react"

interface ControllableProps {
  pageNo?: number
  pageSize?: number
  onChange?: (pageNo: number, pageSize: number) => void
}

interface Options {
  defaultPageNo?: number
  defaultPageSize?: number
}

interface ControlledInfo {
  pageNo: boolean
  pageSize: boolean
}

type ValueKey = 'pageNo' | 'pageSize'

const hasPropName = (props: unknown, value: string) => Object.prototype.hasOwnProperty.call(props, value)

const valueKeys = ['pageNo', 'pageSize'] as Array<ValueKey>

const useControllable = (props: ControllableProps, options: Options = { defaultPageNo: 1, defaultPageSize: 40 }) => {
  const { onChange } = props ?? {}
  const update = useUpdate()

  // 默认值
  const defaultInfo = useMemo(() => {
    const { defaultPageNo, defaultPageSize } = options
    return {
      pageNo: defaultPageNo,
      pageSize: defaultPageSize
    }
  }, [])

  // 是否受控
  const controlledInfo = useMemo(() => {
    const target: ControlledInfo = {} as ControlledInfo
    valueKeys.forEach((key) => {
      target[key] = hasPropName(props, key)
    })
    return target 
  }, [])


  // 初始值
  const initedValue = useMemo(() => {
    const target: Record<ValueKey, number> = {} as Record<ValueKey, number>
  
    valueKeys.forEach((key) => {
      if (controlledInfo[key]) {
        // 当前的值是受控
        target[key] = props[key]!
        return
      }
      target[key] = defaultInfo[key]!
    })
    return target
  }, [])

  const stateRef = useRef(initedValue)

  // 每次刷新都会更新 value 值
  const updateData = () => {
    valueKeys.forEach((key) => {
      if (controlledInfo[key]) {
        // 当前的值是受控
        stateRef.current[key] = props[key]!
      }
    })
    update()
  }
  updateData()

  const setState = useMemoizedFn((v: SetStateAction<Required<Pick<ControllableProps, ValueKey>>>) => {
    const target = isFunction(v) ? v(stateRef.current) : v
    let hasControlled = false

    valueKeys.forEach((key) => {
      if (controlledInfo[key]) {
        // 当前的值是受控
        stateRef.current[key] = target[key]!
        hasControlled = true
      }
    })
    if (hasControlled) {
      update()
    }

    if (onChange) {
      onChange(target.pageNo, target.pageSize)
    }
  })

  return [stateRef.current, setState]
}

export default useControllable
