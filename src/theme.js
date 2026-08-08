(function () {
  // 1. Reference elements and system preference queries
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Clean theme function managing classes, favicons, and local persistence storage
  function applyTheme(theme) {
    // Sync class selector names across HTML document elements
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark-theme', isDark);
    
    // Persist choice to local storage
    localStorage.setItem('theme', theme);

    // Dynamic favicon updates (safely checks if HTML tag exists yet)
    const faviconElement = document.getElementById("favicon");
    if (faviconElement) {
        faviconElement.href = isDark ? "favicons/dark-logo.png" : "favicons/light-logo.png";
    }
  }

  // 2. Immediate Initial Check (Fires quickly to prevent white-flash glitch screens)
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (systemPrefersDark.matches ? 'dark' : 'light');
  applyTheme(initialTheme);

  // 3. Deferred DOM Event Handlers
  document.addEventListener('DOMContentLoaded', () => {
    // Final check to apply favicon once HTML DOM parsing is fully complete
    applyTheme(localStorage.getItem('theme') || initialTheme);

    const toggleBtn = document.getElementById('dark-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        // Toggle theme based on current HTML element class presence
        const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }
  });

  // 4. Automatic System Synchronization Listener
  systemPrefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
    }
  });
})();
