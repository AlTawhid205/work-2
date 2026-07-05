// Shared theme controller — persists dark/light mode across every page.
function nvGetTheme() {
  return localStorage.getItem('nv-theme') || 'light';
}

function nvApplyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.themeToggleBtn').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
  document.querySelectorAll('.themeToggleSwitch').forEach(el => {
    el.classList.toggle('on', theme === 'dark');
  });
}

function nvSetTheme(theme) {
  localStorage.setItem('nv-theme', theme);
  nvApplyTheme(theme);
}

function nvToggleTheme() {
  nvSetTheme(nvGetTheme() === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  nvApplyTheme(nvGetTheme());
  document.querySelectorAll('.themeToggleBtn, .themeToggleSwitch').forEach(el => {
    el.addEventListener('click', nvToggleTheme);
  });
});
