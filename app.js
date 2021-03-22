state = {
  country: 'MAR',
  countryLookup: null,
};

function buildIntro(iso, country) {
  const html = `
    <h1>${country} <span class="thin">Explorer</span></h1>
    <h2>Explore country specific information</h2>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
  `;
  d3.select('#intro').html(html);
}

function prepChartData(data) {
  return d3
    .nest()
    .key(d => d.topic)
    .entries(data);
}

function buildChartModule(chart) {
  console.log(chart);

  const html = `
    <section class="module-head">
      <h3>${chart.title}</h3>
      <h4>${chart.subtitle}</h4>
    </section>
    <section class="module-body">
      <div class="visual-wrap">
        <div class="visual flourish-embed flourish-chart" data-src="visualisation/${chart.id}"></div>
        <div class="visual-info">
          <div class="sources"></div>
          <div class="share"></div>
        </div>
      </div>
      <div class="chart-info">
        <div class="chart-text"></div>
        <div class="chart-links"></div>
      </div>
    </section>
  `;

  return html;
}

function buildContent(data) {
  const nested = prepChartData(data);

  const topics = d3
    .select('#container')
    .selectAll('.topic')
    .data(nested)
    .join('div')
    .attr('class', 'topic');

  topics.append('h3').html(d => d.key);

  topics
    .selectAll('chart-module')
    .data(d => d.values)
    .join('div')
    .attr('class', 'chart-module')
    .html(buildChartModule);
}

function addFlourishEmbedCode() {
  const script = document.createElement('script');
  script.src = '//public.flourish.studio/resources/embed.js';
  document.body.appendChild(script);
}

function ready(data) {
  // Prep data
  const chartInfo = data[0];
  const chartAvail = data[1];
  state.countryLookup = d3.map(data[2], d => d.iso);

  // Build intro.
  buildIntro(state.country, state.countryLookup.get(state.country).name);
  buildContent(chartInfo);
  addFlourishEmbedCode();
}

// Load the data
function load() {
  const charts = d3.csv('data/country-data.csv', d3.autoType);
  const availability = d3.csv('data/data-availability.csv', d3.autoType);
  const countryLookup = d3.csv('data/country-lookup.csv', d3.autoType);

  Promise.all([charts, availability, countryLookup]).then(ready);
}

document.body.onload = load;
