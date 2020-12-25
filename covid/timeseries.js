import Axes from './axes.js';
import Legend from './legend.js';

export default class Timeseries
{
  constructor(parent_element, x, y, width, height)
  {
    this.axes = new Axes(parent_element, x, y, width, height);
    this.axes.xaxis = d3.scaleTime();
    this.svg = this.axes.get_svg();
    this.ymin = 0;
    this.data = {};
    this.lines = {};
    this.areas = {};

    this.title = this.svg
      .append('text')
      .attr('font-size', 20)
      .attr('x', 5)
      .attr('y', 10);

    this.legend = new Legend(this.svg, 10, 10, 10);

    this.line = d3.line()
      .x(d => this.axes.xaxis(d[0]))
      .y(d => this.axes.yaxis(d[1]));

    this.area = d3.area()
      .x(d => this.axes.xaxis(d[0]))
      .y0(d => this.axes.get_ymin_svg_coord())
      .y1(d => this.axes.yaxis(d[1]));
  }

  set_data(name, data, label)
  {
    this.legend.set_text(name, label);
    this.data[name] = data;
    this.ymin = d3.min(data, d => d[1]);
    this.ymax = d3.max(data, d => d[1]);
    this.axes.set_ylim(this.ymin, this.ymax);
    this.set_timescale(data[0][0],data[data.length-1][0]);

    this.svg
      .select('#' + name + '_line')
      .datum(data)
      .attr('d', this.line);

    this.svg
      .select('#' + name + '_area')
      .datum(data)
      .transition()
      .attr('d', this.area);
  }

  set_color(name, color)
  {
    if (name in this.areas)
    {
      this.areas[name]
        .transition('color')
        .attr('fill', color);
      this.legend.set_color(name, color);
    }
  }

  set_opacity(name, opacity)
  {
    if (name in this.areas)
    {
      this.areas[name]
        .attr('fill-opacity', opacity);
    }
  }

  add(data, name, color, label)
  {
    this.legend.add_label(name, color, label);
    this.data[name] = data;
    this.rescale();

    this.lines[name] = this.svg
      .append('path')
      .attr('id', name + '_line')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#fbb034')
      .attr('stroke-width', 1.5)
      .attr('d', this.line);

    this.areas[name] = this.svg
      .append('path')
      .attr('id', name + '_area')
      .datum(data)
      .attr('fill', color)
      .attr('d', this.area);
  }

  focus(name)
  {
    let data = this.data[name];
    this.ymin = d3.min(data, d => d[1]);
    this.ymax = d3.max(data, d => d[1]);
    this.axes.set_ylim(this.ymin, this.ymax);
    this.set_timescale(data[0][0], data[data.length-1][0]);
    this.rescale();
  }

  fit_all()
  {
    for (name in this.data)
    {
      this.ymin = d3.min([d3.min(this.data[name], d => d[1]), this.ymin]);
      this.ymax = d3.max([d3.max(this.data[name], d => d[1]), this.ymax]);
    }
    this.axes.set_ylim(this.ymin, this.ymax);
    this.rescale();
  }

  rescale()
  {
    for (let key in this.lines)
    {
      this.lines[key]
        .attr('d', this.line);
      this.areas[key]
        .transition('area_rescale')
        .attr('d', this.area);
    }
  }

  remove(name)
  {
    this.legend.remove_label(name);
    if (name in this.data) {
      delete this.data[name];
    }
    if (name in this.lines) {
      this.lines[name].remove();
      delete this.lines[name];
    }
    if (name in this.areas) {
      this.areas[name].remove();
      delete this.areas[name];
    }
  }

  set_timescale(start_time, end_time)
  {
    this.axes.xaxis = d3.scaleTime()
      .domain([start_time, end_time]);

    this.axes.xdom
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('user-select', 'none')
      .style('text-anchor', 'end');
  }

  set_ylabel(label)
  {
    this.axes.set_ylabel(label);
  }

  set_title(title)
  {
    this.title
      .text(title);
  }
}

