const tapesContainer = document.getElementById("tapes");
const modal = document.getElementById("modal");

fetch("vid.json")
  .then(response => response.json())
  .then(videos => {

    videos.forEach(video => {

      const btn = document.createElement("button");
      btn.className = "vhs";

      btn.innerHTML = `
        <div class="cassette" style="background:${video.color}">
          <div class="label" style="background:${video.labelColor}">
            ${video.title}
          </div>
        </div>
      `;

      btn.addEventListener("click", () => openVideo(video));

      tapesContainer.appendChild(btn);
    });

  });

function openVideo(video) {

  modal.classList.remove("hidden");

  modal.innerHTML = `
    <div class="player">

      <div class="player-header"
           style="background:${video.labelColor}">
        <div>
          <strong>${video.title}</strong><br>
          ${video.subtitle} · ${video.year}
        </div>
      </div>

      <video
        controls
        autoplay
        playsinline
        width="100%"
        style="display:block;background:#000;">
        <source src="${video.url}" type="video/mp4">
        Tu navegador no soporta video HTML5.
      </video>

      <button id="closeBtn">✕</button>

    </div>
  `;

  document
    .getElementById("closeBtn")
    .addEventListener("click", closeVideo);
}

function closeVideo() {
  modal.classList.add("hidden");
  modal.innerHTML = "";
}

modal.addEventListener("click", e => {
  if (e.target === modal) {
    closeVideo();
  }
});