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
      , elem = document.getElementById(id) 
      , inner_id = 'seasons-'+(+new Date())

    elem.innerHTML = '<div id="'+inner_id+'"></div>'

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
      var pre = ddd.select('#'+inner_id)
        , max = data[idx].data.length.toString().length * line_height/2 

      pre
        .style('overflow', 'hidden')
        .style('height', (data[idx].data.length * line_height + line_height)+'px')  
        .style('width', '100%')
        .style('position', 'relative')

      // updates
      var line = pre
        .selectAll('.seasons-line')
        .data(data[idx].data, key_fn)
        .attr('class', 'active seasons-line')
        .attr('data-line', line_no)
        .style('top', top_fn)
        .style('padding-left', left_fn)

      // insertions
      line
        .enter()
        .append('code')
        .attr('class', 'active seasons-line')
        .attr('data-line', line_no)
        .attr('data-commit', data[idx].commit)
        .style('top', top_fn)
        .style('padding-left', left_fn)
        .html(highlight)


      // deletions
      line
        .exit()
        .attr('class', 'inactive seasons-line')
    
      var hashes = {}

      for(var i = 0, len = data[idx].data.length; i < len; ++i) {
        
        hashes[data[idx].data[i].hash] = hashes[data[idx].data[i].hash] || 0
        hashes[data[idx].data[i].hash]++

        if(hashes[data[idx].data[i].hash] > 1) {
          var prev = data[idx].data[i-1] || {hash:data[idx].data[i].line} 
          data[idx].data[i].newhash = data[idx].data[i].hash+':'+(prev.newhash || prev.hash)
        }
      }

      function left_fn(d) {
        var leading_spaces = d.line.length - d.line.replace(/^\s+/, '').length
        return (leading_spaces * 10 + 10) + (max) + 'px'
      }

      function key_fn(d) {
        return d.newhash || d.hash
      }
    }

    function top_fn(d) {
      return d.num * line_height + 'px'
    }
  
  }

  function line_no(d) {
    return d.num
  }

  function highlight(d) {
    var out = []
      , highlight_rex = 
        /^(return|function|throw|raise|prototype|class|def|arguments|var|this|import|from|with|if|else|elif|try|catch|except)$/
      , content = d.line.replace(/^\s+/, '')
      , len = content.length
      , idx = 0
      , instr = null
      , comment = null
      , word = null
      , c

    while(idx < len) {
      c = content.charAt(idx)
      if(comment === null) {
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
      }

      if(c === '/' && content.charAt(idx+1) === '/') {
        out.splice(idx-1, 0, '<span class="seasons-comment">')
        comment = true
      }

      out.push(c.replace(/\&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#39;'))

      ++idx
    }

    if(comment)
      out.push('</span>')

    return out.join('')+'\n'
  }
})
