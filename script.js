document.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.step, .result-box');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach((el) => fadeObserver.observe(el));
});
