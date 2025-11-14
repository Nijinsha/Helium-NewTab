// Prevent scrolling and ensure full coverage
document.documentElement.style.overflow = 'hidden';
document.body.style.overflow = 'hidden';
document.body.style.height = '100vh';
document.body.style.width = '100vw';

// Hide any Chrome default new tab elements
const hideChromeElements = () => {
  const selectors = [
    '[id*="most-visited"]',
    '[id*="customize"]',
    '[class*="customize"]',
    '[class*="most-visited"]'
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && !el.closest('main')) {
          el.style.display = 'none';
        }
      });
    } catch (e) {}
  });
};

document.addEventListener('DOMContentLoaded', () => {
  hideChromeElements();
  
  // Hide elements that might appear after load
  setTimeout(hideChromeElements, 100);
  setTimeout(hideChromeElements, 500);
  
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  // Focus search input when page loads
  searchInput.focus();

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) return;

    // Check if it's a URL
    if (isURL(query)) {
      const url = addProtocol(query);
      window.location.href = url;
    } else {
      // Search on Google
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.location.href = searchUrl;
    }
  });
});

function isURL(str) {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
  const domainPattern = /^([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
  return urlPattern.test(str) || domainPattern.test(str);
}

function addProtocol(url) {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}

