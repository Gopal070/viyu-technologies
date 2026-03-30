(async function initFloatingIcons() {
  // Prevent duplication
  if (document.getElementById('viyu-floating-icons')) return; 

  try {
    const API_BASE = window.ViyuAPI ? '' : '';
    let settings = null;
    
    // Attempt to fetch settings
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      if (res.ok) {
        settings = await res.json();
      }
    } catch (e) {
      console.warn("Could not fetch settings for floating icons");
    }

    // Check if globally disabled
    const isActive = settings ? settings.isActive !== false : true;
    if (!isActive) return;

    // Build the container
    const container = document.createElement('div');
    container.id = 'viyu-floating-icons';
    
    // Base styles (Desktop)
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '10px';

    // Mobile specific styles adjustment
    if (window.innerWidth <= 768) {
      container.style.bottom = '15px';
      container.style.right = '15px';
    }

    // Configure WhatsApp
    let waPhone = '917785931010';
    let waText = "Hello, I'm interested in your services.";
    if (settings && settings.whatsappNumber) {
      waPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    }
    if (settings && settings.whatsappMessage) {
      waText = settings.whatsappMessage;
    }
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;

    // Configure styling
    let waBgStyle = 'background-color: #25D366;';
    if (settings && settings.bannerBackground) {
      if (settings.bannerBackground.startsWith('assets/')) {
        waBgStyle = `background: url('${API_BASE}/${settings.bannerBackground}') center/cover no-repeat;`;
      } else {
        waBgStyle = `background-color: ${settings.bannerBackground};`;
      }
    }

    // Common CSS for the icons
    const iconBaseCss = `
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: white;
      border-radius: 50%;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: transform 0.3s ease;
      cursor: pointer;
    `;

    // Size for icons
    const size = window.innerWidth <= 768 ? '48px' : '56px';
    const fontSize = window.innerWidth <= 768 ? '20px' : '26px';
    
    container.innerHTML = `
      <style>
        .floating-icon-btn:hover { transform: scale(1.1); color: white; }
      </style>
      <a href="gallery.html" class="floating-icon-btn" title="Gallery" style="${iconBaseCss} width: ${size}; height: ${size}; font-size: ${fontSize}; background-color: #1a73e8;">
        <i class="bi bi-images" style="line-height: 1;"></i>
      </a>
      <a href="${waUrl}" target="_blank" class="floating-icon-btn" title="Chat on WhatsApp" style="${iconBaseCss} width: ${size}; height: ${size}; font-size: ${fontSize}; ${waBgStyle}">
        <i class="bi bi-whatsapp" style="line-height: 1;"></i>
      </a>
    `;

    document.body.appendChild(container);

  } catch (err) {
    console.error('Failed to init floating icons', err);
  }
})();
