const state = {
  country: 'EGY',
  dataAvail: null,
  countryLookup: null,
};

// Helpers
function encodeJSON(input) {
  return encodeURIComponent(JSON.stringify(input));
}

function getChartHash(chart, iso) {
  if (!state.dataAvail.get(iso)[chart.name]) {
    const note = d3.select(`.chart-module#${chart.name} .data-note`);
    note.select('span').html(state.countryLookup.get(iso).name);
    note.style('display', 'block');
    return '';
  }

  if (chart.type === 'line') {
    const settings = {
      series_filter: [iso],
    };
    return encodeJSON(settings);
  }
  if (chart.type === 'bar') {
    const settings = {
      color: {
        categorical_custom_palette: `${iso}:${chart.bar_colour || 'orange'}`,
      },
    };
    return encodeJSON(settings);
  }

  throw Error(`Not sure what to do with chartType: ${chart.type}?`);
}

// Data wrangle.
function prepChartData(data) {
  // Change in place.
  data.forEach(d => {
    d.links = JSON.parse(d.links);
    d.sources = JSON.parse(d.sources);
  });
}

function nestChartData(data) {
  return d3
    .nest()
    .key(d => d.topic)
    .entries(data);
}

// Build DOM.
function buildIntro(country) {
  const html = `
    <h1>${country} <span class="thin">Explorer</span></h1>
    <h2>Explore country specific information</h2>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
  `;
  d3.select('#intro').html(html);
}

function buildChartModuleBase() {
  return `
    <section class="module-head">
      <h3></h3>
      <h4></h4>
      <div class="data-note">Sorry, there's no data for <span></span>, but have a look at these other countries ↓</div>
      <hr>
    </section>

    <section class="module-body">

      <div class="visual-wrap top">

        <div class="visual left">
          <iframe src='' title='Interactive or visual content' frameborder='0' scrolling='no' style='width:100%;height:100%;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
        <div class="visual-text right"></div>
    
      </div>
  
      <div class="info-wrap bottom">

        <div class="chart-info left">
          <div class="sources"></div>
          <div class="share">
            <a href="#"><img src="images/fb.png"/></a>
            <a href="#"><img src="images/tw.png"/></a>
            <a href="#"><img src="images/li.png"/></a>
            <a href="#"><img src="images/ig.png"/></a>
          </div>
        </div>

        <div class="chart-links right">
          <div class="prompt">See also:</div>
          <div class="links"></div>
        </div>

      </div>

    </section>
  `;
}

function buildContent(data) {
  const nested = nestChartData(data);

  // Topics.
  const topics = d3
    .select('#container')
    .selectAll('.topic')
    .data(nested)
    .join('div')
    .attr('class', 'topic');

  topics.append('h3').html(d => d.key);

  // Chart module.
  const module = topics
    .selectAll('chart-module')
    .data(d => d.values)
    .join('div')
    .attr('class', 'chart-module')
    .attr('id', d => d.name)
    .html(buildChartModuleBase);

  // Head.
  module.select('.module-head h3').html(d => d.title);
  module.select('.module-head h4').html(d => d.subtitle);

  // Chart.
  module.select('.visual iframe').attr('src', d => {
    const hash = getChartHash(d, state.country);
    const src = `https://flo.uri.sh/visualisation/${d.id}/embed#${hash}`;
    return src;
  });

  module.select('.visual-text').html(d => d.text);

  // Info sources.
  module
    .select('.sources')
    .html(d =>
      d.sources.map(
        (source, i) =>
          `${i ? '| ' : 'Sources: '}<a href="${source.url}">${source.text}</a>`
      )
    );

  // Info links.
  module
    .select('.chart-links .links')
    .selectAll('.link')
    .data(d => d.links)
    .join('a')
    .attr('href', dd => dd.url)
    .html(dd => dd.text);
}

// Main function.
function ready(data) {
  // Prep data
  const chartInfo = data[0];
  prepChartData(chartInfo);
  state.dataAvail = d3.map(data[1], d => d.iso);
  state.countryLookup = d3.map(data[2], d => d.iso);

  // Build intro.
  buildIntro(state.countryLookup.get(state.country).name);
  buildContent(chartInfo);
}

// Load the data
function load() {
  const charts = d3.csv('data/country-data.csv', d3.autoType);
  const availability = d3.csv('data/data-availability.csv', d3.autoType);
  const countryLookup = d3.csv('data/country-lookup.csv', d3.autoType);

  Promise.all([charts, availability, countryLookup]).then(ready);
}

document.body.onload = load;
