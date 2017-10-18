$ ->
  appendToList = (blocks) ->
    list = []
    for block in blocks
      content = """<a href="/blocks/#{block}">#{block}</a>"""
      list.push $('<li>', html: content).addClass 'list-group-item'
    $('.block-list').append(list)
  
  $.get '/blocks', appendToList

  $('form').on 'submit', (event) ->
    event.preventDefault()
    form = $(@)
    blockData = form.serialize()

    $.ajax
        type: 'POST'
        url: '/blocks'
        data: blockData
      .done (blockName) ->
        appendToList [blockName]
        form.trigger 'reset'
    form.name = ''
    form.description = ''

  $(':text').on 'focus', (event) ->
    event.preventDefault();
    @.value = ''
