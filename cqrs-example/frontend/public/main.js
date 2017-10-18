(function main() {
  'use strict';

  const es = new EventSource('http://localhost:8002/see');

  document.addEventListener('DOMContentLoaded', e => {

    const input = document.querySelector('input');
    const messages = document.querySelector('#messages');
    const render = msg => {
      const el = document.createElement('div');
      el.textContent = msg;
      messages.insertBefore(el, messages.firstChild);
    };

    const parse = sse => {
      const payload = sse.data;
      const { id, body } = JSON.parse(payload);
      return `${body.message} (${id})`;
    };

    es.addEventListener('events.register', event => {
      const payload = event.data;
      const clientId = JSON.parse(payload).id;
      console.log('id', clientId);

      es.addEventListener('events.response', event => {
        const payload = event.data;
        const clientId = JSON.parse(payload).id;
        if (clientId !== clientId) return;
        render(`
          ${parse(event)} 
        `);
      });

      input.addEventListener('keypress', e => {

        if (e.keyCode != 13 || !e.target.value || !e.target.value.trim().length) return

        const json = 'application/json';

        fetch('/cmd', {
          accept: json,
          method: 'post',
          headers: { 'content-type': json },
          body: JSON.stringify({ id: clientId, message: e.target.value.trim(), }),
        }).then(_=> e.target.value = '');

      }, false);
    });

    // es.onmessage = event => render(`
    //   id: ${parse(event)}
    // `);

  }, false);
})();
