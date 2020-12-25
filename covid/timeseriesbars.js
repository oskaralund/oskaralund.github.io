import Axes from './axes.js';

export default class TimeseriesBars
{
  constructor(parent_element, data)
  {
    this.data = data;
    this.axes = new Axes(parent_element, window.innerWidth/2, window.innerHeight/2);
    this.axes.xaxis = d3.scaleTime()
      .domain([data[0][0], data[data.length-1][0]]);
    this.axes.set_ylim(d3.min(data, d => d[1]), d3.max(data, d => d[1]));
    this.svg = this.axes.get_svg();

    this.svg
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
        .attr('x', d => this.axes.xaxis(d[0]))
        .attr('y', d => this.axes.yaxis(d[1]))
        .attr('width', this.axes.axes_width/(data.length-1))
        .attr('height', d => this.axes.axes_height-this.axes.yaxis(d[1]))
        .attr('fill', 'green');
  }

  change_data(data)
  {
    this.data = data;
    this.axes.set_ylim(d3.min(data, d => d[1]), d3.max(data, d => d[1]));
    this.svg
      .selectAll('rect')
      .data(this.data)
      .join('rect')
      .transition()
        .attr('x', d => this.axes.xaxis(d[0]))
        .attr('y', d => this.axes.yaxis(d[1]))
        .attr('width', this.axes.axes_width/(data.length-1))
        .attr('height', d => this.axes.axes_height-this.axes.yaxis(d[1]))
        .attr('fill', 'green');
  }
}
