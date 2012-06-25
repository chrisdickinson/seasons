define(function(require) {
  var d3 = require('d3')
  var seasons = require('./seasons.min')
    , slider = document.getElementById('range')
    , pre = document.getElementById('example')
    , which = document.getElementById('which')
    , current_data
    , changes
    , listener
    , current
    
  slider.addEventListener('change', function(ev) {
    var new_state = ~~((current_data.length-1) * ~~slider.value / 100)
    if(new_state !== current) {
      current = changes(new_state)
    }
  }, true)

  which.addEventListener('change', function(ev) {
    slider.value = current = 0
    got_output(window[which.value])
  })

  got_output(DJANGO_DATA)

  function got_output(data) {
    pre.innerHTML = ''
    changes = seasons('example', data)
    current = changes()
    current_data = data
  }
})

