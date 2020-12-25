export default class Legend
{
  constructor(parent_element, x, y, row_height)
  {
    this.row_height = row_height;
    this.svg = parent_element
      .append('svg')
        .attr('x', x)
        .attr('y', y);

    this.labels = {};
    this.num_labels = 0;
  }

  add_label(name, color, text)
  {
    this.num_labels += 1;
    this.labels[name] = this.svg
      .append('g')
      .attr('id', 'name');

    this.labels[name]
      .append('rect')
        .attr('x', 0)
        .attr('y', 1.5*this.row_height*this.num_labels)
        .attr('width', this.row_height)
        .attr('height', this.row_height)
        .attr('fill', color);

    this.labels[name]
      .append('text')
        .attr('x', 1.5*this.row_height)
        .attr('y', 1.5*this.row_height*(this.num_labels + 0.4))
        .attr('text-anchor', 'left')
        .attr('dominant-baseline', 'middle')
        .text(text)
  }

  set_color(name, color)
  {
    this.labels[name]
      .select('rect')
      .attr('fill', color);
  }

  set_text(name, text)
  {
    this.labels[name]
      .select('text')
      .text(text);
  }

  remove_label(name)
  {
    if (name in this.labels)
    {
      this.labels[name].remove();
      delete this.labels[name];
      this.num_labels -= 1;
    }
  }
}
