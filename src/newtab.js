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
  
  const commandPalette = document.getElementById('command-palette');
  const commandInput = document.getElementById('command-input');
  const backdrop = commandPalette.querySelector('.command-palette-backdrop');
  let isOpen = false;

  // Date and time display functionality
  const dateDisplay = document.getElementById('date-display');
  const timeDisplay = document.getElementById('time-display');
  
  function updateDateTime() {
    const now = new Date();
    
    // Format date: "Monday, January 15, 2024"
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    dateDisplay.textContent = formattedDate;
    
    // Format time: "HH:MM:SS AM/PM"
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    timeDisplay.textContent = formattedTime;
  }
  
  updateDateTime();
  setInterval(updateDateTime, 1000);

  function openPalette() {
    if (isOpen) return;
    isOpen = true;
    commandPalette.classList.remove('hidden');
    setTimeout(() => {
      commandInput.focus();
    }, 10);
  }

  function closePalette() {
    if (!isOpen) return;
    isOpen = false;
    commandPalette.classList.add('hidden');
    commandInput.value = '';
  }

  function executeCommand() {
    const query = commandInput.value.trim();
    
    if (!query) {
      closePalette();
      return;
    }

    // Check if it's a URL
    if (isURL(query)) {
      const url = addProtocol(query);
      window.location.href = url;
    } else {
      // Search on Google
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.location.href = searchUrl;
    }
  }

  // Keyboard shortcuts: Cmd/Ctrl+K to open
  document.addEventListener('keydown', (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;
    
    // Cmd/Ctrl+K to toggle
    if (modifierKey && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    // Escape to close
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closePalette();
      return;
    }

    // Enter to execute
    if (e.key === 'Enter' && isOpen) {
      e.preventDefault();
      executeCommand();
      return;
    }

    // Auto-open when typing (if palette is closed and no input is focused)
    if (!isOpen && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement === document.body) {
      const isPrintableKey = e.key.length === 1 && !e.key.match(/[\x00-\x1F\x7F]/);
      
      if (isPrintableKey) {
        e.preventDefault();
        openPalette();
        commandInput.value = e.key;
        commandInput.focus();
      }
    }
  });

  // Close on backdrop click
  backdrop.addEventListener('click', () => {
    closePalette();
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

