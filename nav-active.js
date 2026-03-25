document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar nav a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) {
      return;
    }

    const targetPath = href.split('/').pop();
    const isCurrent = targetPath === currentPath;

    if (isCurrent) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }
  });
});