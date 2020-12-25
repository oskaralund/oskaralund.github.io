export default class Map
{
  constructor(parent_element, width=400, height=400, color='green')
  {
    this.projection = d3.geoAzimuthalEquidistant();
    this.geo_generator = d3.geoPath().projection(this.projection);
    this.parent_element = d3.select(parent_element);
    this.color = color;

    this.map = this.parent_element
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g');

  }

  init(geojson, click_callback, mouseover_callback, mouseout_callback)
  {
    d3.json(geojson).then((json) => this.update(json, click_callback,
                                                mouseover_callback,
                                                mouseout_callback));
  }

  update(geojson, click_callback, mouseover_callback, mouseout_callback)
  {
    this.map
      .selectAll('path')
      .data(geojson.features)
      .enter()
      .append('path')
      .attr('d', this.geo_generator)
      .attr('fill', this.color)
      .attr('id', (d,i) => d['properties']['name'].replace(/\s/g, ''))
      .on('mouseover', mouseover_callback)
      .on('mouseout', mouseout_callback)
      .on('click', click_callback);

    const bbox = this.map.node().getBBox();
    this.parent_element.select('svg')
      .attr('viewBox', [bbox.x, bbox.y, bbox.width, bbox.height]);
  }

  set_color(county, color)
  {
    this.map
      .select('#' + county)
      .attr('fill', color);
  }

  set_map_color(color)
  {
    this.map
      .selectAll('path')
      .attr('fill', color);
  }
}
