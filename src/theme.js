(function () {
  function setTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('dark-toggle-btn');

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
})();
