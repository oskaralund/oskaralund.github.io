import Map from './map.js';
import Timeseries from './timeseries.js';
import Button from './button.js';

export default class CoronaWidget
{
  constructor(geojson)
  {
    const viewbox_width = 1000;
    const viewbox_height = 500;
    const map_width = 200;
    const map_height = 300;
    const graph_width = 800;
    const graph_height = 300;

    this.unselected_color = '#8a7967';
    this.selected_color = '#c1d82f';
    this.hover_color = '#ff0000';
    this.selected_county = 'Sverige';

    this.svg = d3.select('body')
      .append('div')
      .classed('svg-container', true)
      .append('svg')
      .attr('id', 'corona_widget')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + viewbox_width + ' ' + viewbox_height)
      .classed('svg-content-responsive', true);

    this.svg
      .append('rect')
        .attr('width', 1000)
        .attr('height', 310)
        .attr('fill', '#fbfbfb')

    this.map = new Map('#corona_widget', map_width, map_height,
                       this.unselected_color);
    this.map.init(geojson,
      this.map_click_cb(),
      this.map_mouseover_cb(),
      this.map_mouseout_cb());

    this.cases_data = undefined;
    this.deaths_data = undefined;
    this.icu_data = undefined;
    this.totals_data = undefined;
    this.total_deaths = 0;
    this.total_icu = 0;
    this.total_cases = 0;

    this.timeseries = new Timeseries('#corona_widget', map_width, 0, graph_width,
                                     graph_height);
    this.buttons = [];

    //Create buttons
    this.buttons.push(
      new Button('#corona_widget', 0, 310, 333, 60,
        'green', this.total_cases,'/img/fever.svg'));
    this.buttons.push(
      new Button('#corona_widget', 333, 310, 333, 60,
        '#ffc202', this.total_cases,'/img/hospital-bed.svg'));
    this.buttons.push(
      new Button('#corona_widget', 666, 310, 333, 60,
        'red', this.total_cases,'/img/death.svg'));

    //Load data
    d3.json('/covid/data/cases_rolling_means.json').then( d => {
      this.cases_data = d;
      var data = this.get_county_data('Sverige');
      this.timeseries.add(data, 'selected', this.unselected_color, 'Sverige');
      this.timeseries.focus('selected');
      this.timeseries.set_title('Nya fall');
    });

    d3.json('/covid/data/deaths.json').then(d => {
      var range = [...Array(Object.keys(d['date']).length).keys()];
      this.deaths_data = range.map(
        i => [new Date(d['date'][i]),
                       parseFloat(d['num_dead'][i])]
      );
    });

    d3.json('/covid/data/icu.json').then(d => {
      var range = [...Array(Object.keys(d['date']).length).keys()];
      this.icu_data = range.map(
        i => [new Date(d['date'][i]),
                       parseFloat(d['num_icu'][i])]
      );
    });

    d3.json('/covid/data/totals.json').then(d => {
      this.totals_data = d;
      this.total_cases = d['cases']['Sverige'];
      this.buttons[0].set_number(this.total_cases);
      this.total_icu = d['icu']['Sverige'];
      this.buttons[1].set_number(this.total_icu);
      this.total_deaths = d['dead']['Sverige'];
      this.buttons[2].set_number(this.total_deaths);
    });

  }

  map_click_cb()
  {
    var widget = this;
    function cb(d)
    {
      var county = d3.select(this).attr('id');
      if (widget.selected_county == county) {
        county = 'Sverige';
        widget.selected_county = 'Sverige';
      }
      select_county(widget, county);
    }
    return cb;
  }

  map_mouseover_cb()
  {
    var widget = this;
    function cb(d)
    {
      var county = d3.select(this).attr('id');
      if (county != widget.selected_county)
      {
        widget.map.set_color(county, widget.hover_color);
        widget.timeseries.add(
          widget.get_county_data(county), county, widget.hover_color, county
        );
        widget.timeseries.set_opacity(county, 0.3);
        widget.timeseries.fit_all();
      }
    }
    return cb;
  }

  map_mouseout_cb()
  {
    var widget = this;
    function cb(d)
    {
      var county = d3.select(this).attr('id');
      if (county != widget.selected_county)
      {
        widget.map.set_color(county, widget.unselected_color);
      }
      else
      {
        widget.map.set_color(county, widget.selected_color);
      }
      widget.timeseries.focus('selected');
      widget.timeseries.remove(county);
    }
    return cb;
  }

  get_county_data(county)
  {
    var range = [...Array(Object.keys(this.cases_data['date']).length).keys()];
    var data = range.map(i => [new Date(this.cases_data['date'][i]),
                               parseFloat(this.cases_data[county][i])]);
    return data;
  }
}

function select_county(widget, county)
{
    widget.map.set_map_color(widget.unselected_color);
    widget.map.set_color(county, widget.selected_color);
    widget.selected_county = county;
    widget.timeseries
      .set_data('selected', widget.get_county_data(county), county);
    widget.timeseries
      .set_color('selected', widget.selected_color);
    widget.timeseries
      .set_color(county, widget.selected_color);
    widget.timeseries.remove(county);
    widget.timeseries.rescale();
    widget.buttons[0].set_number(widget.totals_data['cases'][county]);
    widget.buttons[1].set_number(widget.totals_data['icu'][county]);
    widget.buttons[2].set_number(widget.totals_data['dead'][county]);
    widget.timeseries.set_title('Nya fall');

    d3.select('h1')
      .html(`COVID19 ${county}`);
}

var widget = new CoronaWidget('/covid/data/sweden.json');
