document.addEventListener('DOMContentLoaded', () => {
  // ---- Fade-in on scroll ----
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

  // ---- Scroll-driven timeline state ----
  const timelineStates = {
    0: {
      commits: {1:'unknown',2:'unknown',3:'unknown',4:'unknown',5:'unknown',6:'unknown',7:'unknown',8:'unknown',9:'unknown',10:'unknown'},
      labels: {1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:'',10:''},
      activeConnectors: []
    },
    1: {
      commits: {1:'good',2:'unknown',3:'unknown',4:'unknown',5:'checking',6:'unknown',7:'unknown',8:'unknown',9:'unknown',10:'bad'},
      labels: {1:'✓ works',2:'',3:'',4:'',5:'checking…',6:'',7:'',8:'',9:'',10:'✗ broken'},
      activeConnectors: [3]
    },
    2: {
      commits: {1:'good',2:'good',3:'good',4:'good',5:'good',6:'unknown',7:'unknown',8:'checking',9:'unknown',10:'bad'},
      labels: {1:'✓ works',2:'✓ works',3:'✓ works',4:'✓ works',5:'✓ works',6:'',7:'',8:'checking…',9:'',10:'✗ broken'},
      activeConnectors: [4, 5, 6]
    },
    3: {
      commits: {1:'good',2:'good',3:'good',4:'good',5:'good',6:'culprit',7:'bad',8:'bad',9:'bad',10:'bad'},
      labels: {1:'✓ works',2:'✓ works',3:'✓ works',4:'✓ works',5:'✓ works',6:'🐛 culprit',7:'✗ broken',8:'✗ broken',9:'✗ broken',10:'✗ broken'},
      activeConnectors: [4, 5]
    }
  };

  let currentTimelineStep = -1;

  function updateTimeline(step) {
    if (step === currentTimelineStep) return;
    currentTimelineStep = step;
    const state = timelineStates[step];
    const commits = document.querySelectorAll('.timeline .commit');
    const connectors = document.querySelectorAll('.timeline .connector');
    const labels = document.querySelectorAll('.version-labels .vlabel');

    commits.forEach((el) => {
      const v = parseInt(el.dataset.version);
      el.className = 'commit ' + state.commits[v];
    });

    connectors.forEach((el, i) => {
      el.classList.toggle('active', state.activeConnectors.includes(i));
    });

    labels.forEach((el) => {
      const v = parseInt(el.dataset.version);
      const text = state.labels[v];
      el.textContent = text;
      el.style.color = '';
      el.style.fontWeight = '';
      if (state.commits[v] === 'culprit') {
        el.style.color = '#C96040';
        el.style.fontWeight = '500';
      } else if (state.commits[v] === 'bad') {
        el.style.color = '#C96040';
      } else if (state.commits[v] === 'checking') {
        el.style.color = '#7B6DB8';
      }
    });
  }

  updateTimeline(0);

  const stepEls = document.querySelectorAll('.step[data-step]');

  const timelineObserver = new IntersectionObserver(() => {
    // Find the highest visible step
    let maxVisible = 0;
    stepEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7) {
        const s = parseInt(el.dataset.step);
        if (s > maxVisible) maxVisible = s;
      }
    });
    updateTimeline(maxVisible);
  }, { threshold: 0 });

  stepEls.forEach((el) => timelineObserver.observe(el));
});
