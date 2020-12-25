export default class Axes
{
  constructor(parent_element, x, y, width, height)
  {
    this.figure_width = width;
    this.figure_height = height;
    this.axes_margin = {top: 10, bottom: 40, right: 30, left: 50};
    this.axes_width = this.figure_width - this.axes_margin.right - this.axes_margin.left;
    this.axes_height = this.figure_height - this.axes_margin.top - this.axes_margin.bottom;

    this.svg = d3.select(parent_element)
      .append('svg')
        .attr('width', this.figure_width)
        .attr('height', this.figure_height)
        .attr('x', x)
      .append('g')
        .attr('transform', 'translate(' + this.axes_margin.left + ',' + this.axes_margin.top + ')');

    this.x = d3.scaleLinear()
      .domain([0, 1])
      .range([0, this.axes_width]);

    this.xlim = [0,1];

    this.xdom = this.svg
      .append('g')
      .attr('transform', 'translate(0,' + this.axes_height + ')')
      .call(d3.axisBottom(this.x));

    this.y = d3.scaleLinear()
      .range([this.axes_height, 0])
      .domain([0, 1]);

    this.ylim = [0,1];

    this.ydom = this.svg
      .append('g')
      .call(d3.axisLeft(this.y));

    this.ylabel = this.svg
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -this.axes_margin.left)
        .attr('x', -this.figure_height/2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
  }

  set_ylabel(label)
  {
    this.ylabel.text(label);
  }

  set xaxis(xaxis)
  {
    this.x = xaxis;
    this.x.range([0, this.axes_width]);
    this.xdom
      .transition()
      .call(d3.axisBottom(this.x));
  }

  get xaxis()
  {
    return this.x;
  }

  set yaxis(yaxis)
  {
    this.y = yaxis;
    this.y.range([this.axes_height, 0]);
    this.ydom
      .call(d3.axisLeft(this.y));
  }

  get yaxis()
  {
    return this.y;
  }

  set_xlim(min, max)
  {
    this.xlim = [min, max];
    this.x.domain([min,max]);
    this.xdom
      .transition()
      .duration(1000)
      .call(d3.axisBottom(this.x));
  }

  set_ylim(min,max)
  {
    this.ylim = [min, max];
    this.y.domain([min,max]);
    this.ydom
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.y));
  }

  get_ymin_svg_coord()
  {
    return this.y(this.ylim[0]);
  }

  set xticks(n)
  {
    this.xdom
      .call(d3.axisBottom(this.x).ticks(n));
  }

  get_svg()
  {
    return this.svg;
  }
}
