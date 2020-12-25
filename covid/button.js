export default class Button
{
  constructor(parent_element,x,y,width,height,color,number,icon)
  {
    this.svg =
      d3.select(parent_element)
        .append('svg');

    this.svg
      .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'white')
        .attr('stroke', color)
        .attr('stroke-width', 0.2)
        .on('mouseover', this.mouseover_cb);

    this.svg
      .append('image')
        .attr('href', icon)
        .attr('x', x+0.2*height)
        .attr('y', y+0.2*height)
        .attr('width', 0.6*height)
        .attr('height', 0.6*height);

    this.number = this.svg
      .append('text')
        .style('user-select', 'none')
        .style('font-family', 'courier, arial, helvetica')
        .attr('font-size', 32)
        .attr('fill', color)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('x', x+width/2)
        .attr('y', y+height/2)
        .text('0');
  }

  set_number(number)
  {
    this.number
      .transition()
      .duration(500)
      .textTween(() => t => parseInt(t*number));
  }
}
