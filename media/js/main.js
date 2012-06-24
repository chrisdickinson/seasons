define(function(require) {
  var d3 = require('d3')
  var seasons = require('./seasons.min')

  got_output(PLATE_DATA)

  function got_output(data) {
    var changes = seasons('example', data)
      , current = changes()
      , slider = document.getElementById('range')
      
    slider.addEventListener('change', function(ev) {
      var new_state = ~~((data.length-1) * ~~slider.value / 100)
      if(new_state !== current) {
        current = changes(new_state)
      }
    }, true)
    
  }
})

