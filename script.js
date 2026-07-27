
    /* ── Smooth anchor scrolling and reveal animations ── */
    (function () {
      var anchors = document.querySelectorAll('a[href^="#"]');
      var revealTargets = document.querySelectorAll('.s1-inner, .s2-inner, .s3-card, .s4-inner, .s5-intro, .s5-featured, .s5-carousel, .s6-inner, .s7-header, .s7-item, .s8-metrics, .s8-copy, .s9-inner, .ftr-top, .ftr-compliance');

      revealTargets.forEach(function (target) {
        target.classList.add('reveal');
      });

      function showReveal(entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }

      if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(showReveal, { threshold: 0.16 });
        revealTargets.forEach(function (target) {
          revealObserver.observe(target);
        });
      } else {
        revealTargets.forEach(function (target) {
          target.classList.add('is-visible');
        });
      }

      anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
          var id = anchor.getAttribute('href');
          if (!id || id === '#') return;
          var target = document.querySelector(id);
          if (!target) return;

          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    })();

    /* ── Play button keyboard support ── */
    (function () {
      var playBtn = document.querySelector('.s1-play-btn');
      if (!playBtn) return;
      playBtn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playBtn.click();
        }
      });
    })();

    /* ── Header scroll ── */
    (function () {
      var header = document.getElementById('site-header');
      window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    })();

    /* ── Section 7 accordion ── */
    (function () {
      var triggers = document.querySelectorAll('.s7-trigger');

      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var item   = trigger.closest('.s7-item');
          var panel  = item.querySelector('.s7-panel');
          var isOpen = trigger.classList.contains('is-open');

          triggers.forEach(function (t) {
            t.classList.remove('is-open');
            t.setAttribute('aria-expanded', 'false');
            t.closest('.s7-item').querySelector('.s7-panel').classList.remove('is-open');
          });

          if (!isOpen) {
            trigger.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            panel.classList.add('is-open');
          }
        });
      });

      triggers[0].click();
    })();

    /* ── Section 2 ticker ── */
    (function () {
      var counter = document.getElementById('s2-counter');
      if (!counter) return;

      var target   = 50000;
      var duration = 2200;
      var started  = false;

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function fmt(n) {
        var s = '' + Math.floor(n);
        var r = '';
        for (var i = 0; i < s.length; i++) {
          if (i > 0 && (s.length - i) % 3 === 0) r += ',';
          r += s[i];
        }
        return '$' + r;
      }

      function run(startTs) {
        function tick(ts) {
          var progress = Math.min((ts - startTs) / duration, 1);
          counter.textContent = fmt(target * easeOutCubic(progress));
          if (progress < 1) requestAnimationFrame(tick);
        }
        tick(startTs); // render $0 immediately, then RAF drives the rest
      }

      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !started) {
          started = true;
          requestAnimationFrame(run);
        }
      }, { threshold: 0.2 });

      obs.observe(document.querySelector('.s2'));
    })();

    /* ── Section 9 expandable ── */
    (function () {
      var trigger = document.querySelector('.s9-expand-trigger');
      var panel   = document.querySelector('.s9-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = trigger.classList.contains('is-open');
        if (isOpen) {
          trigger.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          panel.classList.remove('is-open');
        } else {
          trigger.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          panel.classList.add('is-open');
        }
      });
    })();

    /* ── Section 5 carousel ── */
    (function () {
      var track = document.querySelector('.s5-carousel-track');
      var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.s5-slide')) : [];
      var prev = document.querySelector('.s5-arrow-prev');
      var next = document.querySelector('.s5-arrow-next');
      var dots = Array.prototype.slice.call(document.querySelectorAll('.s5-dot'));
      if (!track || !slides.length) return;

      function slideWidth() {
        return slides[0].getBoundingClientRect().width + 16;
      }

      function activeIndex() {
        var left = track.scrollLeft + 2;
        var index = 0;

        slides.forEach(function (slide, slideIndex) {
          if (slide.offsetLeft <= left) {
            index = slideIndex;
          }
        });

        return index;
      }

      function setDots(index) {
        dots.forEach(function (dot, dotIndex) {
          var isActive = dotIndex === index;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }

      function goTo(index) {
        var clamped = Math.max(0, Math.min(index, slides.length - 1));
        slides[clamped].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        setDots(clamped);
      }

      if (prev) {
        prev.addEventListener('click', function () {
          goTo(activeIndex() - 1);
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          goTo(activeIndex() + 1);
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          goTo(index);
        });
      });

      track.addEventListener('scroll', function () {
        window.requestAnimationFrame(function () {
          setDots(activeIndex());
        });
      }, { passive: true });

      setDots(0);
    })();
  