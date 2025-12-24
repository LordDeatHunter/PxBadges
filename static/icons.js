const MAX_TILT_DEG = 30;
const PERSPECTIVE = 300;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".logo").forEach((logo) => {
    const el = logo.querySelector("span");

    logo.style.perspective = `${PERSPECTIVE}px`;

    logo.addEventListener("mousemove", (e) => {
      const { left, top, width, height } = logo.getBoundingClientRect();
      const normalizedMousePos = {
        x: (e.clientX - left) / width - 0.5,
        y: (e.clientY - top) / height - 0.5,
      };
      const rotation = {
        x: -normalizedMousePos.y * MAX_TILT_DEG * 2,
        y: normalizedMousePos.x * MAX_TILT_DEG * 2,
      };

      el.style.transform = `
        perspective(${PERSPECTIVE}px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
      `;
    });

    logo.addEventListener("mouseleave", () => {
      el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
    });
  });
});
