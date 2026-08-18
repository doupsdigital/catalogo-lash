document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.vitrine > section');
  const fotoWraps = document.querySelectorAll(
    '.hero__foto-wrap, .sobre__foto-wrap, .manutencao__foto-wrap, .cuidados__foto-wrap, .contato__foto-wrap'
  );

  // Set initial scales for photo wraps
  if (fotoWraps.length > 0 && typeof gsap !== 'undefined') {
    gsap.set(fotoWraps, { scale: 1 });
  }

  // IntersectionObserver to handle active section snap detection & animations (1 scroll = 1 section snap model)
  const observerOptions = {
    root: document.querySelector('.vitrine'),
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      const wrap = section.querySelector(
        '.hero__foto-wrap, .sobre__foto-wrap, .manutencao__foto-wrap, .cuidados__foto-wrap, .contato__foto-wrap'
      );

      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        section.classList.add('is-active');

        // Ken Burns zoom effect on background photo when section becomes active
        if (wrap && !reduceMotion && typeof gsap !== 'undefined') {
          gsap.to(wrap, {
            scale: 1.08,
            duration: 7,
            ease: 'sine.out',
            overwrite: 'auto',
          });
        }
      } else {
        section.classList.remove('is-active');

        // Reset photo scale smoothly when section is left
        if (wrap && !reduceMotion && typeof gsap !== 'undefined') {
          gsap.to(wrap, {
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
});
