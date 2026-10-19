/* ZainSoft · Tarjetas digitales — comportamiento común.
   Cada tarjeta define window.TARJETA = { ... } antes de cargar este archivo
   y marca su HTML con atributos data-*. Todo es opcional: si un bloque no
   está en la página, simplemente no se activa. */
(function () {
  const C = window.TARJETA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const pad = n => String(n).padStart(2, '0');

  /* ---------- Sobre de apertura (también habilita la música) ---------- */
  const sobre = $('[data-sobre]');
  // Con ?abierta en la dirección la tarjeta arranca sin el sobre (para vistas previas y capturas)
  if (sobre && new URLSearchParams(location.search).has('abierta')) sobre.remove();
  else if (sobre) {
    document.documentElement.classList.add('con-sobre');
    const abrir = () => {
      if (sobre.classList.contains('abierto')) return;
      sobre.classList.add('abierto');
      document.documentElement.classList.remove('con-sobre');
      if (C.musica || C.audio) Musica.play();
      setTimeout(() => sobre.remove(), 1200);
    };
    sobre.addEventListener('click', abrir);
    sobre.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(); } });
    sobre.focus();
  }

  /* ---------- Cuenta regresiva ---------- */
  const cd = $('[data-countdown]');
  if (cd && C.fecha) {
    const meta = new Date(C.fecha).getTime();
    const out = k => $(`[data-${k}]`, cd);
    const tick = () => {
      let s = Math.max(0, Math.floor((meta - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      out('d').textContent = d; out('h').textContent = pad(h);
      out('m').textContent = pad(m); out('s').textContent = pad(s);
      if (meta <= Date.now()) cd.classList.add('llego');
    };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Agendar (Google Calendar y archivo .ics) ---------- */
  const fmt = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const inicio = C.fecha, fin = C.fin || C.fecha;
  $$('[data-agendar-google]').forEach(a => {
    const p = new URLSearchParams({ action: 'TEMPLATE', text: C.evento || 'Evento', dates: `${fmt(inicio)}/${fmt(fin)}`, location: C.lugar || '', details: location.href });
    a.href = 'https://calendar.google.com/calendar/render?' + p;
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-agendar-ics]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ZainSoft//Tarjetas//ES', 'BEGIN:VEVENT',
      `UID:${fmt(inicio)}-${Math.random().toString(36).slice(2)}@zainsoft`, `DTSTAMP:${fmt(Date.now())}`,
      `DTSTART:${fmt(inicio)}`, `DTEND:${fmt(fin)}`, `SUMMARY:${C.evento || 'Evento'}`,
      `LOCATION:${(C.lugar || '').replace(/,/g, '\\,')}`, `URL:${location.href}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    Object.assign(document.createElement('a'), { href: url, download: 'evento.ics' }).click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }));

  /* ---------- Mapa ---------- */
  $$('[data-mapa]').forEach(f => { f.src = 'https://www.google.com/maps?q=' + encodeURIComponent(C.mapa || C.lugar || '') + '&output=embed'; });
  $$('[data-como-llegar]').forEach(a => {
    a.href = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(C.mapa || C.lugar || '');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* ---------- Confirmar asistencia por WhatsApp ---------- */
  const form = $('form[data-rsvp]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = new FormData(form);
      const nombre = (f.get('nombre') || '').trim();
      if (!nombre) { form.nombre.focus(); return; }
      const va = f.get('asiste') !== 'no';
      const lineas = [
        `Hola! Soy ${nombre}.`,
        va ? `Confirmo mi asistencia: ${C.evento} ✨` : `Lamentablemente no voy a poder ir (${C.evento}). ¡Gracias por la invitación!`,
        va && f.get('cantidad') ? `Vamos: ${f.get('cantidad')}` : '',
        va && (f.get('menu') || '').trim() ? `Menú especial: ${f.get('menu').trim()}` : '',
        va && (f.get('cancion') || '').trim() ? `Canción que no puede faltar: ${f.get('cancion').trim()}` : '',
        (f.get('mensaje') || '').trim() ? `Mensaje: ${f.get('mensaje').trim()}` : ''
      ].filter(Boolean).join('\n');
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(lineas)}`, '_blank', 'noopener');
      form.classList.add('enviado');
    });
    // Los campos de "vamos" se ocultan si responde que no
    const sync = () => form.classList.toggle('no-asiste', (new FormData(form)).get('asiste') === 'no');
    $$('input[name=asiste]', form).forEach(r => r.addEventListener('change', sync)); sync();
  }

  /* ---------- Copiar alias / CBU ---------- */
  $$('[data-copiar]').forEach(b => b.addEventListener('click', async () => {
    const txt = b.dataset.copiar, prev = b.textContent;
    try { await navigator.clipboard.writeText(txt); }
    catch { const t = Object.assign(document.createElement('textarea'), { value: txt }); document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
    b.textContent = '¡Copiado!'; b.classList.add('ok');
    setTimeout(() => { b.textContent = prev; b.classList.remove('ok'); }, 1800);
  }));

  /* ---------- Galería con visor ---------- */
  const figs = $$('[data-galeria] figure');
  if (figs.length) {
    const visor = Object.assign(document.createElement('div'), { className: 'visor', hidden: true });
    visor.innerHTML = '<button class="visor-x" aria-label="Cerrar">×</button><button class="visor-prev" aria-label="Anterior">‹</button><div class="visor-cont"></div><button class="visor-next" aria-label="Siguiente">›</button>';
    document.body.append(visor);
    let i = 0;
    const show = n => { i = (n + figs.length) % figs.length; $('.visor-cont', visor).innerHTML = figs[i].innerHTML; };
    figs.forEach((f, n) => { f.tabIndex = 0; f.addEventListener('click', () => { show(n); visor.hidden = false; }); });
    $('.visor-x', visor).onclick = () => (visor.hidden = true);
    $('.visor-prev', visor).onclick = () => show(i - 1);
    $('.visor-next', visor).onclick = () => show(i + 1);
    visor.addEventListener('click', e => { if (e.target === visor) visor.hidden = true; });
    document.addEventListener('keydown', e => {
      if (visor.hidden) return;
      if (e.key === 'Escape') visor.hidden = true;
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  /* ---------- Aparición al hacer scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Música: caja musical sintetizada (sin archivos ni derechos de autor) ----------
     Si la tarjeta define C.audio (ruta a un mp3 del cliente), se usa ese archivo. */
  const PRESETS = {
    // tempo (ms por nota), tónica MIDI, progresión de acordes (grados) y patrón de arpegio
    vals: { paso: 380, base: 62, acordes: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]], patron: [0, 1, 2, 1, 2, 1], tipo: 'sine' },
    fiesta: { paso: 210, base: 65, acordes: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]], patron: [0, 2, 1, 2, 0, 2, 1, 2], tipo: 'triangle' },
    cuna: { paso: 520, base: 67, acordes: [[0, 4, 7], [5, 9, 12], [0, 4, 7], [7, 11, 14]], patron: [0, 1, 2, 1], tipo: 'sine' }
  };
  const Musica = {
    on: false, ctx: null, timer: null, audio: null, n: 0,
    play() {
      if (C.audio) {
        this.audio = this.audio || Object.assign(new Audio(C.audio), { loop: true, volume: .5 });
        this.audio.play().catch(() => {});
      } else {
        const P = PRESETS[C.musica] || PRESETS.vals;
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        this.ctx.resume();
        const nota = (midi, t, dur, vol) => {
          const o = this.ctx.createOscillator(), g = this.ctx.createGain();
          o.type = P.tipo; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
          g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01);
          g.gain.exponentialRampToValueAtTime(.0001, t + dur);
          o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + dur + .05);
        };
        const porAcorde = P.patron.length;
        this.timer = setInterval(() => {
          const t = this.ctx.currentTime + .05;
          const ac = P.acordes[Math.floor(this.n / porAcorde) % P.acordes.length];
          const k = this.n % porAcorde;
          nota(P.base + 12 + ac[P.patron[k]], t, P.paso / 1000 * 2.2, .07);
          if (k === 0) nota(P.base - 12 + ac[0], t, P.paso / 1000 * porAcorde, .05);
          this.n++;
        }, P.paso);
      }
      this.on = true; this.ui();
    },
    stop() {
      if (this.audio) this.audio.pause();
      clearInterval(this.timer); this.timer = null;
      this.on = false; this.ui();
    },
    ui() { $$('[data-musica]').forEach(b => { b.classList.toggle('sonando', this.on); b.setAttribute('aria-pressed', this.on); b.setAttribute('aria-label', this.on ? 'Pausar música' : 'Reproducir música'); }); }
  };
  $$('[data-musica]').forEach(b => b.addEventListener('click', () => (Musica.on ? Musica.stop() : Musica.play())));
  Musica.ui();
})();
