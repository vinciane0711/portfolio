import * as d3 from 'd3'

export const margin = { top: 30, right: 10, bottom: 0, left: 10 }
export const initChart = (
  el: HTMLElement,
  cityList: string[],
  func: (...arg: any) => void
) => {
  const barSize = 30
  const n = cityList.length
  const width = 350
  const _h = barSize * n
  const height = _h + margin.top + margin.bottom
  const _w = width - margin.left - margin.right

  const barChart = d3.select(el).attr('viewBox', [0, 0, width, height])
  const x = d3.scaleLinear().rangeRound([0, _w])
  const y = d3.scaleBand().rangeRound([0, _h]).padding(0.2).domain(cityList)

  const contentWrap = barChart.select('.contentWrap')
  const barsGroup = contentWrap.select('.barsGroup')
  const textGroup = contentWrap.select('.textGroup')
  const labelGroup = contentWrap.select('.labelGroup')
  const valueGroup = contentWrap.select('.valueGroup')
  const zeroLine = contentWrap.select('line').attr('y2', _h)

  textGroup
    .selectAll('text')
    .data(cityList)
    .join('text')
    .attr('dy', 16)
    .attr('x', 2)
    .attr('y', (d) => y(d) as number)
    .text((d) => d)

  labelGroup
    .selectAll('rect')
    .data(cityList)
    .join('rect')
    .attr('x', -2)
    .attr('y', (d) => y(d) as number)
    .attr('height', y.bandwidth())
    .attr('width', _w + 2)
    .attr('fill', 'transparent')
    .attr('cursor', 'pointer')
    .on('click', (e, d) => func(d))

  function axis() {
    const g = contentWrap.append('g')
    const axis = d3.axisTop(x).ticks(5, '~s').tickSizeOuter(0)
    return () => g.transition().call(axis)
  }

  const updateAxis = axis()

  function selectCity(id: string) {
    textGroup
      .selectAll('text')
      .attr('opacity', (d) => (d === id ? '1' : '0.4'))
      .attr('font-weight', (d) => (d === id ? 'bold' : 'normal'))
    valueGroup
      .selectAll('text')
      .attr('opacity', (d) => (d === id ? '1' : '0.4'))
      .attr('font-weight', (d) => (d === id ? 'bold' : 'normal'))
    barsGroup
      .selectAll('rect')
      .attr('opacity', (d) => (d === id ? '0.5' : '0.2'))
  }

  let xPo = (d: number) => x(0)
  let widthFunc = (d: number) => {
    return _w
  }

  function updateRange(range: [number, number]) {
    x.domain(range)
    updateAxis()
    zeroLine.transition().attr('x1', x(0)).attr('x2', x(0))

    xPo = (d: number) => (d > 0 ? x(0) : x(d) < 0 ? 0 : x(d))
    widthFunc = (d: number) => {
      const w = range.includes(0) ? _w : _w / 2
      const diff = Math.abs(x(d) - x(0))
      return diff >= w ? w : diff
    }
  }

  function updateChart(data: Record<string, number>) {
    barsGroup
      .selectAll('rect')
      .data(cityList)
      .join(
        (enter) =>
          enter
            .append('rect')
            .attr('opacity', 0.2)
            .attr('height', y.bandwidth())
            .attr('y', (d) => y(d) as number)
            .attr('x', (d) => xPo(data[d]))
            .attr('fill', (d) =>
              data[d] > 0 ? 'var(--mainColor)' : 'var(--subColor)'
            )
            .attr('width', (d) => widthFunc(data[d])),
        (update) =>
          update
            .transition()
            .duration(750)
            .attr('x', (d) => xPo(data[d]))
            .attr('fill', (d) =>
              data[d] > 0 ? 'var(--mainColor)' : 'var(--subColor)'
            )
            .attr('width', (d) => widthFunc(data[d]))
      )

    valueGroup
      .selectAll('text')
      .data(cityList)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('dy', 16)
            .attr('x', _w - 2)
            .attr('y', (d) => y(d) as number)
            .text((d) => data[d].toLocaleString()),
        (update) => update.text((d) => data[d].toLocaleString())
      )
  }

  return { updateRange, updateChart, selectCity }
}
