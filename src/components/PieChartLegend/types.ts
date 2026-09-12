export type PieChartLegendItem = {
  id: number | string
  label: string
  color: string
}

export type PieChartLegendProps = {
  items: PieChartLegendItem[]
}
