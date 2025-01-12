import { createContext, useContext } from 'react'
import type { Table } from '@tanstack/react-table'

export const TableContext = createContext< {table: Table<any> | null }>({ table: null })

export const useTableContext = () => useContext(TableContext)
