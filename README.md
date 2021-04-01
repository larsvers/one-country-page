# ONE country page base structure

## The charts

- You make your chart in Flourish with all countries included
- A few topline requirements from a page build perspective:
  - Each topic ('topic_id` in _country-data.csv_) and chart ('name` in _country-data.csv_) needs a name that can be used as a CSS selector → lowercase, no special characters, dash separated words. You should hold on to this chart name across all datasets.
  - Bar chart
    - Color mode: row
    - Palette: single color
    - URL settings: `color.categorical_custom_palette`
  - Line chart
    - Series filter: Multi select
    - Max series to show: ~3 
    - URL settings: `series_filter`
  - Stacked area chart
    - URL settings: `row_filter`

## The data

There are 3 data sets to maintain:

1. `country-lookup.csv` (to translate iso codes to country names)
2. `country-data.csv` (that's the main one driving the page build)
3. `data-availability.csv` (which data is available for each country and each chart)

The link between dataset 2 and 3 is the chart's `name`.

The `country-data.csv` is the main set driving the DOM build.

The data is pulled from [this repo](https://github.com/larsvers/one-country-page-data) here. However, this repo also has the datasets included (and commented out in the `load` function) for easy building and debugging.

_Note, that I kept topics and chart module data in one file (each row represents a chart). We can split these into multiple files which would make maintenance a little easier column-wise, but you'd have more files to maintain._

## The page

The page pulls in the data and builds out a page header, as many topic sections there are and per topic section as many chart modules as there are.

The **page intro** is currently hardcoded in JS and hence the same for all countries.

The **topic sections** currently shows title and intro.

Each **chart module** consists of:

- a title/subtitle
- a data availability note 
- the visual
- text section
- a source section
- a share section 
- a link section 

The layout as well as the charts are **responsive** - but this is a first go at layout and styling - you might want to refine it to your needs...

Also, the **share sections** are not wired up as you might have share logic at the ready. These can link to the page URL, or each individual chart as each chart module uses the chart's name as an id which can be used as a URL hash to link directly to the chart.

