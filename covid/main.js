import Map from './map.js';
import TimeseriesBars from './timeseriesbars.js';
import Timeseries from './timeseries.js';

function get_covid_data(covid_array, county)
{
  const N = Object.keys(covid_array['date']).length;
  var data = [];
  if (county in covid_array)
  {
    for (var i = 0; i < N; i++)
    {
      data.push([new Date(covid_array['date'][i]), parseFloat(covid_array[county][i])]);
    }
    return data;
  }
  else
  {
    return undefined;
  }
}

d3.select('body')
  .append('center')
  .append('div')
  .classed('svg-container', true)
  .append('svg')
  .attr('id', 'main_div')
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', '0 0 1000 500')
  .classed('svg-content-responsive', true)

var cases;
var icu;
var deaths;
var timeseries;
var num_dead = 0;
var num_cases = 0;
var num_icu = 0;

d3.json('/static/covid19/icu.json').then(function(d) {
  const N = Object.keys(d['Statistikdatum']).length;
  icu = [];
  for (var i = 0; i < N; i++)
  {
    icu.push([new Date(d['Statistikdatum'][i]),
               parseFloat(d['Antal'][i])]);
  }
});

d3.json('/static/covid19/deaths.json').then(function(d) {
  const N = Object.keys(d['Statistikdatum']).length;
  deaths = [];
  for (var i = 0; i < N; i++)
  {
    deaths.push([new Date(d['Statistikdatum'][i]),
               parseFloat(d['Antal'][i])]);
    num_dead += parseInt(d['Antal'][i]);
  }
  d3.select('#dead')
    .select('text')
    .transition()
    .duration(5000)
    .textTween(() => t => parseInt(t*num_dead));
});

d3.json('/static/covid19/totals.json').then(function(d) {
  num_cases = d['Totalt_antal_fall'][21]
  d3.select('#cases')
    .select('text')
    .transition()
    .duration(5000)
    .textTween(() => t => parseInt(t*num_cases));

  num_icu = d['Totalt_antal_IVA'][21]
  d3.select('#icu')
    .select('text')
    .transition()
    .duration(5000)
    .textTween(() => t => parseInt(t*num_icu));
});


var selected_county = undefined;
var map = new Map(d3.select('#main_div'), 200, 300);

function click_callback(d) {
  var county_name = d['properties']['name'];
  if (selected_county == county_name)
  {
    d3.select(this)
      .attr('fill', 'green');
    county_name = 'total';
  }
  else
  {
    map.map
      .selectAll('path')
      .attr('fill','green');
    d3.select(this)
      .attr('fill', '#ffc202');
  }
  selected_county = county_name;
  var data = get_covid_data(cases, county_name);
  if (data != undefined)
  {
    timeseries.change_data(data);
    d3.select('h1')
      .transition()
      .style('opacity',0)
      .transition()
      .style('opacity',1)
      .text('COVID19 ' + county_name + ' — Nya fall');
  }
  d3.select('#buttons')
    .selectAll('image')
    .style('outline', 'none')
}

function mouseover_callback(d)
{
  d3.select(this)
    .attr('fill','#ffc202');
}

function mouseout_callback(d)
{
  if (d['properties']['name'] != selected_county)
  {
    d3.select(this)
      .attr('fill','green');
  }
}

map.init('/static/covid19/sweden.json',
         click_callback, mouseover_callback, mouseout_callback);

d3.json('/static/covid19/cases_rolling_means.json').then(function(d) {
  cases = d;
  var data = get_covid_data(cases, 'total');
  timeseries = new Timeseries( d3.select('#main_div'), 200, 0, 800, 300, data);
});


d3.select('#main_div')
  .append('g')
  .attr('id', 'buttons')
  .selectAll('svg')
  .data(['cases', 'icu', 'dead'])
  .join('svg')
  .attr('id', d => d)

d3.select('#cases')
  .append('image')
  .attr('href', '/static/covid19/fever.svg')
  .attr('x', 200)
  .attr('y', 350)
  .attr('width', 50)
  .attr('height', 50)
  .style('outline', 'solid black');

d3.select('#cases')
  .append('text')
  .attr('x', 265)
  .attr('y', 375);

d3.select('#icu')
  .append('image')
  .attr('x', 400)
  .attr('y', 350)
  .attr('href', '/static/covid19/hospital-bed.svg')
  .attr('width', 50)
  .attr('height', 50);

d3.select('#icu')
  .append('text')
  .attr('x', 465)
  .attr('y', 375);

d3.select('#dead')
  .append('image')
  .attr('x', 600)
  .attr('y', 350)
  .attr('href', '/static/covid19/death.svg')
  .attr('width', 50)
  .attr('height', 50);

d3.select('#dead')
  .append('text')
  .attr('x', 665)
  .attr('y', 375);

d3.select('#icu')
  .on('click', function(d) {
    timeseries.change_data(icu);
    d3.select('h1')
      .transition()
      .style('opacity',0)
      .transition()
      .style('opacity',1)
      .text('COVID19 Sverige — Nyinlagda på IVA');

    d3.select('#buttons')
      .selectAll('image')
      .style('outline', 'none')
    d3.select(this)
      .select('image')
      .style('outline', 'solid black')

    map.map
      .selectAll('path')
      .attr('fill','green');
  });

d3.select('#dead')
  .on('click', function(d) {
    timeseries.change_data(deaths);
    d3.select('h1')
      .transition()
      .style('opacity',0)
      .transition()
      .style('opacity',1)
      .text('COVID19 Sverige — Dödsfall');

    d3.select('#buttons')
      .selectAll('image')
      .style('outline', 'none')
    d3.select(this)
      .select('image')
      .style('outline', 'solid black')

    map.map
      .selectAll('path')
      .attr('fill','green');
  });

d3.select('#cases')
  .on('click', function(d) {
    var data = get_covid_data(cases, 'total');
    timeseries.change_data(data);
    d3.select('h1')
      .transition()
      .style('opacity',0)
      .transition()
      .style('opacity',1)
      .text('COVID19 Sverige — Nya fall');

    d3.select('#buttons')
      .selectAll('image')
      .style('outline', 'none')
    d3.select(this)
      .select('image')
      .style('outline', 'solid black')

    map.map
      .selectAll('path')
      .attr('fill','green');
  });
