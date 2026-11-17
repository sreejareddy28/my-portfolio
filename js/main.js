/* Page interactions: menu, typing effect, scroll reveal, active link, back to top */
(function () {
  document.documentElement.classList.add('js');

  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  var toTop = document.getElementById('toTop');

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Navbar style + back-to-top button
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    toTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Typing effect
  var roles = ['Full Stack Support Engineer', 'Python Developer', 'Web Developer', 'B.Tech Graduate', 'Fast Learner'];
  var typed = document.getElementById('typed');
  var r = 0, c = 0, deleting = false;
  function type() {
    var word = roles[r];
    c += deleting ? -1 : 1;
    typed.textContent = word.slice(0, c);
    var delay = deleting ? 45 : 90;
    if (!deleting && c === word.length) { deleting = true; delay = 1500; }
    else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 300; }
    setTimeout(type, delay);
  }
  type();

  // Scroll reveal + active nav link
  var reveals = document.querySelectorAll('.reveal');
  var sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); revealObs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObs.observe(el); });

    var linkObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.querySelectorAll('a').forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { linkObs.observe(s); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }
})();
