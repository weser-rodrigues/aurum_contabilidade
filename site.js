/* AURUM — shared interactions */
(function () {
  // Sticky header state
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile nav toggle
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Scroll reveal (progressive enhancement — base state is visible)
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    var root = document.documentElement;
    root.classList.add('anim-ready'); // opt into hidden-then-animate
    var pending = reveals.slice();
    var revealCheck = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = pending.length - 1; i >= 0; i--) {
        if (pending[i].getBoundingClientRect().top < vh * 0.92) {
          pending[i].classList.add('in');
          pending.splice(i, 1);
        }
      }
    };
    revealCheck();
    window.addEventListener('scroll', revealCheck, { passive: true });
    window.addEventListener('resize', revealCheck);
    window.addEventListener('load', revealCheck);
    // Watchdog: if animations aren't actually painting, force everything visible.
    setTimeout(function () {
      var t = document.querySelector('.reveal.in');
      if (t && parseFloat(getComputedStyle(t).opacity) < 0.05) {
        root.classList.add('no-anim');
      }
    }, 900);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      item.classList.toggle('open', !isOpen);
      ans.style.maxHeight = isOpen ? null : ans.scrollHeight + 'px';
    });
  });

  // Contact form (if present)
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var valid = input.value.trim().length > 0;
        if (input.type === 'email') valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value);
        field.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (ok) {
        form.style.display = 'none';
        var s = document.querySelector('.form-success');
        if (s) s.classList.add('show');
      }
    });
    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('input', function () {
        input.closest('.field').classList.remove('invalid');
      });
    });
  }
})();
