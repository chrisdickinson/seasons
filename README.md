# Seasons.js

View changes to a file over time.

## Installation

To generate data:

````
    npm install -g seasons
    build_seasons ../../path/to/some/file/in/some/repo
    # should create an `output.json` in your cwd.
````

To use in-browser with require:

````html
    <link rel="stylesheet" href="https://chrisdickinson.github.com/seasons/media/css/seasons.css" />
    <script type="javascript">
    require.config({paths:{seasons:'https://chrisdickinson.github.com/seasons/media/js/seasons.min'}})
    require(['seasons'], function(seasons) {
        seasons('#id', {data})
    })
    </script>
````

And it should work with [browserify](https://github.com/substack/browserify) too.

## API

### seasons = require('seasons') -> function

Returns the `seasons` function.

### seasons(id, data[, lineHeight][, highlighter]) -> function

Given commit data and a DOM id, display the code contained in `data`.

## Building Seasons data

````bash
    build_seasons ../../path/to/some/file/in/some/repo
    # should create an `output.json` in your cwd.
````

