export default class Plot
{
  constructor(parent_element, data)
  {
    this.data = data;
    this.axes = new Axes(parent_element);
    this.axes.set_xlim(d3.min(data, d => d[0]), d3.max(data, d => d[0]));
    this.axes.set_ylim(d3.min(data, d => d[1]), d3.max(data, d => d[1]));
    this.svg = this.axes.get_svg();

    this.svg
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.5)
      .attr('d', d3.line()
        .x(d => this.axes.xaxis(d[0]))
        .y(d => this.axes.yaxis(d[1]))
        );
  }
}
