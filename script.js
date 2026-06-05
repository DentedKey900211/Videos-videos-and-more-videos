/* =============================================
   BIBLIOTECA — Colección de Obras Escogidas
   Script.js
   ============================================= */

(async function () {
  const shelfEl      = document.getElementById('shelfItems');
  const playerFrame  = document.getElementById('videoPlayer');
  const playerTitle  = document.getElementById('playerTitleText');
  const iframeWrap   = document.querySelector('.iframe-container');

  let videos = [];
  let activeId = null;

  /* --- Load video list --- */
  try {
    const res = await fetch('vid.json');
    if (!res.ok) throw new Error('No se pudo cargar vid.json');
    videos = await res.json();
  } catch (err) {
    console.error(err);
    shelfEl.innerHTML = '<p style="color:var(--ink-light);font-style:italic;padding:1rem;">No se encontraron obras.</p>';
    return;
  }

  /* --- Build shelf cassettes --- */
  videos.forEach((video) => {
    const cassette = document.createElement('div');
    cassette.className = 'vhs-cassette';
    cassette.title     = formatTitle(video.title);
    cassette.dataset.id = video.id;

    const label = document.createElement('span');
    label.className = 'cassette-spine-label';
    label.textContent = formatTitle(video.title);

    const dot = document.createElement('span');
    dot.className = 'cassette-active-dot';

    cassette.appendChild(label);
    cassette.appendChild(dot);
    cassette.addEventListener('click', () => playVideo(video, cassette));
    shelfEl.appendChild(cassette);
  });

  /* Auto-play first video */
  if (videos.length > 0) {
    const firstCassette = shelfEl.querySelector('.vhs-cassette');
    playVideo(videos[0], firstCassette);
  }

  /* --- Play a video --- */
  function playVideo(video, cassetteEl) {
    if (activeId === video.id) return;
    activeId = video.id;

    /* Deactivate all cassettes */
    shelfEl.querySelectorAll('.vhs-cassette').forEach(c => c.classList.remove('active'));
    cassetteEl.classList.add('active');

    /* Fade out player, swap src, fade in */
    iframeWrap.style.opacity = '0';
    setTimeout(() => {
      playerFrame.src = buildEmbedUrl(video.file);
      playerTitle.textContent = formatTitle(video.title);
      iframeWrap.style.transition = 'opacity 0.5s ease';
      iframeWrap.style.opacity = '1';
    }, 300);
  }

  /* --- Helpers --- */

  /**
   * Ensure the Cloudinary player URL has autoplay enabled.
   * Accepts both the embed URL form and raw public_id forms.
   */
  function buildEmbedUrl(rawUrl) {
    try {
      const url = new URL(rawUrl);
      url.searchParams.set('autoplay', 'true');
      url.searchParams.set('muted', 'false');
      return url.toString();
    } catch {
      return rawUrl;
    }
  }

  /**
   * Convert snake/camel-cased titles to readable form.
   * e.g. "ensayo_gran_turismo" → "Ensayo Gran Turismo"
   */
  function formatTitle(str) {
    return str
      .replace(/[_\-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
})();
