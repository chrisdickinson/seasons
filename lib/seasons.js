if(typeof define === 'undefined')
  define = function(fn) { module.exports = fn() } 

define(function(require) {
  var ddd = require('d3')

  if(typeof ddd == 'undefined') {
    ddd = window.d3
  }

  seasons.highlight = highlight

  return seasons

  function seasons(id, data, line_height, highlighter) {
    var current = 0

    line_height = line_height || 20

    id = id.charAt(0) === '#' ? id : '#'+id

    on_state(current)

    return function() {
      if(arguments.length == 0) {
        return current
      } else {
        on_state(current = arguments[0])
        return current
      }
    }

    function on_state(idx) {
      var pre = ddd.select(id)
        , max = data[idx].data.length.toString().length * 10 + 20

      // updates
      var line = pre
        .selectAll('.seasons-line')
        .data(data[idx].data, key_fn)
        .attr('class', 'active seasons-line')
        .attr('data-line', line_no)
        .style('top', top_fn)
        .html(highlight)

      // insertions
      line
        .enter()
        .append('code')
        .attr('class', 'active seasons-line')
        .attr('data-line', line_no)
        .style('top', top_fn)
        .html(highlight)

      // deletions
      line
        .exit()
        .attr('class', 'inactive seasons-line')
    }
  }

  function key_fn(d) {
    return d.hash
  }

  function line_no(d) {
    return d.num
  }

  function top_fn(d) {
    return d.num * line_height + 'px'
  }

  function highlight(d) {
    var out = []
      , highlight_rex = 
        /^(return|function|prototype|class|def|arguments|var|this|import|from|with|if|else|elif|try|catch|except)$/
      , len = d.line.length
      , content = d.line
      , idx = 0
      , instr = null
      , word = null
      , c

    while(idx < len) {
      c = content.charAt(idx)
      if(/['"]/.test(c)) {
        if(instr !== null) {
          out.splice(instr, 0, '<span class="seasons-literal">')
          out.push('</span>')
          instr = null
        } else {
          instr = idx
        }
      } else if(instr === null && /[^\w\d]/.test(c) && word !== null) {
        if(highlight_rex.test(out.slice(word).join(''))) {
          out.splice(word, 0, '<span class="seasons-keyword">')
          out.push('</span>')
        }

        word = null
      } else if(instr === null && /[\w\d]/.test(c) && word === null) {
        word = idx
      }

      out.push(c.replace(/\&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#39;'))

      ++idx
    }

    return out.join('')+'\n'
  }
})
