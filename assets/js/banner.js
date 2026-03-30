(async function initGlobalBanner() {
  try {
    // Rely on ViyuAPI if loaded, or fetch manually
    const API_BASE = window.ViyuAPI ? '' : '';
    
    // Fetch Settings
    const setRes = await fetch(`${API_BASE}/api/settings`);
    if (!setRes.ok) return;
    const settings = await setRes.json();
    
    if (!settings.isActive) return;

    // Build the banner container
    const bannerContainer = document.createElement('div');
    bannerContainer.id = 'viyu-global-banner';
    bannerContainer.style.zIndex = '9999';

    // WhatsApp Link Formatting
    let waPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    let waText = encodeURIComponent(settings.whatsappMessage || 'Hi, I would like to know more.');
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

    if (settings.bannerType === 'floatingButton') {
      // Floating Button Style
      bannerContainer.style.position = 'fixed';
      bannerContainer.style.bottom = '20px';
      bannerContainer.style.right = '20px';
      bannerContainer.style.display = 'flex';
      bannerContainer.style.flexDirection = 'column';
      bannerContainer.style.gap = '15px';
      bannerContainer.style.alignItems = 'center';
      
      let bgColor = settings.bannerBackground || '#25D366';
      let bgStyle = `background: ${bgColor};`;
      if (bgColor.startsWith('assets/')) {
        bgStyle = `background: url('${API_BASE}/${bgColor}') center/cover no-repeat;`;
      }

      bannerContainer.innerHTML = `
        <a href="gallery.html" title="View Gallery" style="display:flex; align-items:center; justify-content:center; width:50px; height:50px; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.3); text-decoration:none; background: #0d6efd; color:white; font-size:24px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <i class="bi bi-images"></i>
        </a>
        <a href="${waUrl}" target="_blank" title="Chat with Us" style="display:flex; align-items:center; justify-content:center; width:60px; height:60px; border-radius:50%; box-shadow:0 4px 10px rgba(0,0,0,0.3); text-decoration:none; ${bgStyle} color:white; font-size:30px; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
          <i class="bi bi-whatsapp"></i>
        </a>
      `;
    } else {
      // Bottom Banner Style
      bannerContainer.style.position = 'fixed';
      bannerContainer.style.bottom = '0';
      bannerContainer.style.left = '0';
      bannerContainer.style.width = '100%';
      bannerContainer.style.boxShadow = '0 -4px 10px rgba(0,0,0,0.1)';
      bannerContainer.style.padding = '10px 20px';
      bannerContainer.style.display = 'flex';
      bannerContainer.style.alignItems = 'center';
      bannerContainer.style.justifyContent = 'space-between';
      bannerContainer.style.flexWrap = 'wrap';
      bannerContainer.style.gap = '15px';
      
      let bgColor = settings.bannerBackground || '#212529';
      if (bgColor.startsWith('assets/')) {
        bannerContainer.style.background = `url('${API_BASE}/${bgColor}') center/cover no-repeat`;
      } else {
        bannerContainer.style.backgroundColor = bgColor;
      }

      // Left: Gallery Preview
      let galleryHtml = '';
      if (settings.showGalleryPreview) {
        try {
          const limit = settings.galleryPreviewCount || 4;
          const mediaRes = await fetch(`${API_BASE}/api/media?limit=${limit}`);
          if (mediaRes.ok) {
            const media = await mediaRes.json();
            if (media.length > 0) {
              galleryHtml = `
                <div style="display:flex; gap:8px; align-items:center; overflow-x:auto; max-width:60%;">
                  <span style="color:white; font-size:0.8rem; font-weight:bold; margin-right:5px; text-shadow:1px 1px 2px #000;">LATEST WORK:</span>
                  ${media.map(m => {
                    const imgUrl = m.type === 'photo' ? m.url : (m.thumbnail || 'assets/images/placeholder-video.svg');
                    return `<a href="gallery.html" title="${m.title}" style="flex-shrink:0;">
                      <img src="${API_BASE}/${imgUrl}" alt="${m.title}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid #fff;">
                    </a>`;
                  }).join('')}
                </div>
              `;
            }
          }
        } catch (e) { console.error('Banner gallery error', e); }
      }

      // Right: WhatsApp Action
      bannerContainer.innerHTML = `
        ${galleryHtml}
        <a href="${waUrl}" target="_blank" style="background:#25D366; color:#fff; padding:8px 16px; border-radius:20px; text-decoration:none; font-weight:bold; display:inline-flex; align-items:center; gap:8px; box-shadow:0 2px 5px rgba(0,0,0,0.2);">
          <i class="bi bi-whatsapp"></i> Chat with Us
        </a>
      `;
    }

    document.body.appendChild(bannerContainer);
  } catch (err) {
    console.error('Failed to initialize global banner:', err);
  }
})();
