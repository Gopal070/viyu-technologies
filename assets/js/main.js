const HEADER_OFFSET = 110;

// Smooth scroll for same-page anchors (#id)
function smoothScrollTo(targetId) {
  if (!targetId || !targetId.startsWith('#')) return;

  const target = document.querySelector(targetId);
  if (!target) return;

  const elementTop = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetTop = elementTop - HEADER_OFFSET;

  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  });
}

// Delegate clicks for in-page anchors
document.addEventListener('click', function (e) {
  const link = e.target.closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (!href) return;

  if (href.startsWith('#')) {
    e.preventDefault();
    smoothScrollTo(href);
  }
});

// Quick-link active (home page sections only)
const quickLinks = document.querySelectorAll('.quick-link');
const sectionIds = [];

quickLinks.forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href.startsWith('#') && !sectionIds.includes(href)) {
    sectionIds.push(href);
  }
});

function updateActiveQuickLink() {
  if (!sectionIds.length || !quickLinks.length) return;

  let currentId = null;

  sectionIds.forEach(id => {
    const section = document.querySelector(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;

    if (sectionTop <= HEADER_OFFSET + 10 && sectionBottom > HEADER_OFFSET + 10) {
      currentId = id;
    }
  });

  quickLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', currentId && href === currentId);
  });
}

// TOP PHOTO CHANGING – hero background loop
document.addEventListener('DOMContentLoaded', function () {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const heroImages = [
    'assets/images/walkietalki.jpeg',
    'assets/images/STQC CP PLUS 4 MP IP Dome Camera.jpeg',
    'assets/images/WIFI 2.jpg',
    'assets/images/SMART HOME.webp',
    'assets/images/Waterproof CCTV Bullet Camera.jpeg'
  ];

  let index = 0;
  const changeEvery = 3000; // 3 seconds

  setInterval(function () {
    index = (index + 1) % heroImages.length;

    hero.style.backgroundImage =
      'linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.5)), ' +
      'url("' + heroImages[index] + '")';
  }, changeEvery);
});

window.addEventListener('scroll', updateActiveQuickLink, { passive:true });
window.addEventListener('load', updateActiveQuickLink);

// RIGHT-SIDE PRODUCT SLIDER (image + text)
document.addEventListener('DOMContentLoaded', function () {
  var imgEl   = document.getElementById('hero-product-img');
  var titleEl = document.getElementById('hero-product-title');
  var textEl  = document.getElementById('hero-product-text');
  var listEl  = document.getElementById('hero-product-list');

  if (!imgEl || !titleEl || !textEl || !listEl) return;

  var slides = [
    {
      img: 'assets/images/HD CCTV Camera.jpeg',
      title: '  CCTV Camera Kits',
      text: 'Complete HD/IP CCTV packages with recorder, storage and mobile viewing.',
      points: [
        'Indoor & outdoor bullet/dome cameras',
        'Mobile and desktop live view',
        'On-site installation and setup'
      ]
    },
    {
      img: 'assets/images/Tiandy CCTV Camera 2 MP IP Bullet.jpeg',
      title: 'IP CCTV for Offices & Shops',
      text: 'High-resolution IP cameras with network video recorders for clear evidence.',
      points: [
        'Remote access from mobile app',
        'Night vision & wide dynamic range',
        'Recording with motion alerts'
      ]
    },
    {
      img: 'assets/images/Waterproof CCTV Bullet Camera.jpeg',
      title: 'Outdoor Bullet Cameras',
      text: 'Weatherproof cameras for perimeters, gates and parking areas.',
      points: [
        'Metal housings and IP66 rating',
        'Long-range IR illumination',
        'Ideal for campuses & factories'
      ]
    }
  ];

  var i = 0;
  var changeEvery = 4000; // 6 seconds

  function renderSlide(index){
    var s = slides[index];
    imgEl.src = s.img;
    titleEl.textContent = s.title;
    textEl.textContent = s.text;

    listEl.innerHTML = '';
    s.points.forEach(function(p){
      var li = document.createElement('li');
      li.textContent = p;
      listEl.appendChild(li);
    });
  }

  renderSlide(i);

  setInterval(function () {
    i = (i + 1) % slides.length;
    renderSlide(i);
  }, changeEvery);
});


// Simple form feedback
document.querySelectorAll('form[data-feedback="simple"]').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let hasEmpty = false;
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        hasEmpty = true;
        field.classList.add('is-invalid');
      } else {
        field.classList.remove('is-invalid');
      }
    });

    if (hasEmpty) {
      alert('Please fill all required fields before submitting.');
      return;
    }

    alert('Thank you! Your enquiry has been submitted. Our team will contact you shortly.');
    form.reset();
  });
});

//img change
document.addEventListener("DOMContentLoaded", function(){
  // About overview slider
  const aboutSectionImgs = document.querySelectorAll(".about-section-bg-img");
  if(aboutSectionImgs.length){
    let idx = 0;
    const total = aboutSectionImgs.length;
    const interval = 9000; // 9 seconds per image

    setInterval(() => {
      aboutSectionImgs[idx].classList.remove("is-active");
      idx = (idx + 1) % total;
      aboutSectionImgs[idx].classList.add("is-active");
    }, interval);
  }
});


// Scroll-in animations
const animatedEls = document.querySelectorAll('.animate-on-scroll');

if ('IntersectionObserver' in window && animatedEls.length){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:0.15
  });

  animatedEls.forEach(el => observer.observe(el));
}
document.addEventListener("DOMContentLoaded", function(){
  const heroBgImgs = document.querySelectorAll(".about-hero-bg-img");
  if(!heroBgImgs.length) return;  // sirf about page me chale

  let currentIndex = 0;
  const total = heroBgImgs.length;
  const interval = 7000; // 7 sec per image

  setInterval(() => {
    // current ko hide
    heroBgImgs[currentIndex].classList.remove("is-active");

    // next index
    currentIndex = (currentIndex + 1) % total;

    // next ko show
    heroBgImgs[currentIndex].classList.add("is-active");
  }, interval);
});


// Quick links active state based on visible section
document.addEventListener('DOMContentLoaded', function() {
  const quickLinks = document.querySelectorAll('.quick-links-bar a');
  const sections = Array.from(quickLinks).map(link => {
    const hash = link.getAttribute('href');
    if (hash && hash.startsWith('#')) {
      return document.querySelector(hash);
    }
    return null;
  }).filter(section => section !== null);

  function setActiveLink() {
    let currentId = '';
    const scrollPosition = window.scrollY + 150; // thoda offset for better detection

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        currentId = '#' + section.id;
      }
    });

    quickLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentId) {
        link.classList.add('active');
      }
    });
  }

  // Page load par agar URL mein hash hai to usko active karo
  if (window.location.hash) {
    const hashLink = document.querySelector(`.quick-links-bar a[href="${window.location.hash}"]`);
    if (hashLink) {
      setTimeout(() => {
        hashLink.classList.add('active');
      }, 100);
    }
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('load', setActiveLink);
});

// Quick links click par active set karo (immediate feedback)
document.querySelectorAll('.quick-links-bar a').forEach(link => {
  link.addEventListener('click', function(e) {
    // Active class hatake is par laga do
    document.querySelectorAll('.quick-links-bar a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    // Smooth scroll already handle ho raha hai main.js mein
  });
});