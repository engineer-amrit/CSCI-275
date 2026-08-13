// Lightweight avatar upload + crop widget.
// No external libraries — draws to a canvas, lets the user pan/zoom,
// and writes the cropped result as a base64 data URL into a hidden input
// so it gets submitted with the rest of the form (stored in avatar_url column).

function initAvatarCrop(rootId) {
  const root = document.getElementById(rootId);
  if (!root) return;

  const fileInput = root.querySelector('.avatar-file-input');
  const canvas = root.querySelector('.avatar-crop-canvas');
  const zoomRange = root.querySelector('.avatar-zoom-range');
  const hiddenInput = root.querySelector('.avatar-hidden-input');
  const preview = root.querySelector('.avatar-preview');
  const canvasWrap = root.querySelector('.avatar-crop-wrap');

  const ctx = canvas.getContext('2d');
  const SIZE = canvas.width; // square canvas

  let img = null;
  let scale = 1;
  let baseScale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    const w = img.width * baseScale * scale;
    const h = img.height * baseScale * scale;
    ctx.drawImage(img, SIZE / 2 - w / 2 + offsetX, SIZE / 2 - h / 2 + offsetY, w, h);
    ctx.restore();
    hiddenInput.value = canvas.toDataURL('image/jpeg', 0.85);
  }

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      img = new Image();
      img.onload = () => {
        baseScale = Math.max(SIZE / img.width, SIZE / img.height);
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        canvasWrap.style.display = 'block';
        if (preview) preview.style.display = 'none';
        draw();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  zoomRange.addEventListener('input', () => {
    scale = parseFloat(zoomRange.value);
    if (img) draw();
  });

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener('mouseup', () => (dragging = false));
  window.addEventListener('mousemove', (e) => {
    if (!dragging || !img) return;
    offsetX += e.clientX - lastX;
    offsetY += e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    draw();
  });

  // Basic touch support for mobile
  canvas.addEventListener('touchstart', (e) => {
    dragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
  });
  window.addEventListener('touchend', () => (dragging = false));
  window.addEventListener('touchmove', (e) => {
    if (!dragging || !img) return;
    offsetX += e.touches[0].clientX - lastX;
    offsetY += e.touches[0].clientY - lastY;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    draw();
  });
}
