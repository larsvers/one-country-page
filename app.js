state = {
  country: 'MAR',
  countryLookup: null,
};

function prepChartData(data) {
  // Change in place.
  data.forEach(d => {
    d.links = JSON.parse(d.links);
    d.sources = JSON.parse(d.sources);
  });
}

function buildIntro(iso, country) {
  const html = `
    <h1>${country} <span class="thin">Explorer</span></h1>
    <h2>Explore country specific information</h2>
    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
  `;
  d3.select('#intro').html(html);
}

function nestChartData(data) {
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
      <hr>
    </section>
    <section class="module-body">
      <div class="visual-wrap">
        <div class="visual">
          <iframe src='https://flo.uri.sh/visualisation/${
            chart.id
          }/embed' title='Interactive or visual content' frameborder='0' scrolling='no' style='width:100%;height:100%;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe>
        </div>
        <div class="visual-info">
          <div class="sources">
            ${chart.sources
              .map(
                (source, i) =>
                  `${i ? '| ' : 'Sources: '}<a href="${source.url}">${
                    source.text
                  }</a>`
              )
              .join('')}
          </div>
          <div class="share">
            <a href="#"><img src="images/fb.png"/></a>
            <a href="#"><img src="images/tw.png"/></a>
            <a href="#"><img src="images/li.png"/></a>
            <a href="#"><img src="images/ig.png"/></a>
          </div>
        </div>
      </div>
      <div class="chart-info">
        <div class="chart-text-wrap">
          <div class="chart-text">
            ${chart.text}
          </div>
        </div>
        <div class="chart-links">
          See also: </br>
          ${chart.links
            .map(link => `<a href="${link.url}">${link.text}</a></br>`)
            .join('')}
        </div>
      </div>
    </section>
  `;

  return html;
}

function buildContent(data) {
  const nested = nestChartData(data);

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

function ready(data) {
  // Prep data
  const chartInfo = data[0];
  prepChartData(chartInfo);
  const chartAvail = data[1];
  state.countryLookup = d3.map(data[2], d => d.iso);

  // Build intro.
  buildIntro(state.country, state.countryLookup.get(state.country).name);
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
