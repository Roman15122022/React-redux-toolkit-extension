import React from 'react'

import { PieChartLegendProps } from './types'

const PieChartLegend = ({ items }: PieChartLegendProps): JSX.Element => {
  return (
    <ul
      role="list"
      className="grid w-full grid-cols-2 gap-x-4 gap-y-2 pb-4 pr-1 text-xs"
    >
      {items.map(({ id, label, color }) => (
        <li key={id} className="theme-text flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="truncate" title={label}>
            {label}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default PieChartLegend
