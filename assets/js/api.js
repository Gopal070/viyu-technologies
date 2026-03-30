/**
 * VIYU TECHNOLOGIES — Shared API Helper
 * Include this script in any page that needs to fetch products or submit contacts.
 *
 * Usage:
 *   <script src="assets/js/api.js"></script>
 *   <script>
 *     ViyuAPI.loadProducts('cctv', 'products-container');
 *   </script>
 */
const ViyuAPI = (() => {
  // Base URL — empty string means same origin (works when served by Express)
  const API_BASE = '';

  // ── Fetch products by category ──
  async function fetchProducts(category, limit) {
    let url = `${API_BASE}/api/products?category=${encodeURIComponent(category)}`;
    if (limit) url += `&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  // ── Fetch single product by ID ──
  async function fetchProduct(id) {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  }

  // ── Submit contact form ──
  async function submitContact(data) {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Submission failed');
    return result;
  }

  // ── Fetch media gallery items ──
  async function fetchMedia(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/api/media?${queryParams}`);
    if (!res.ok) throw new Error('Failed to fetch media');
    return res.json();
  }

  // ── Fetch Services ──
  async function fetchServices(all = false) {
    const res = await fetch(`${API_BASE}/api/services${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  }

  // ── Fetch Solutions ──
  async function fetchSolutions(all = false) {
    const res = await fetch(`${API_BASE}/api/solutions${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch solutions');
    return res.json();
  }

  // ── Fetch About Us Data ──
  async function fetchAboutUs() {
    const res = await fetch(`${API_BASE}/api/about`);
    if (!res.ok) throw new Error('Failed to fetch about us data');
    return res.json();
  }

  // ── Fetch Site Settings (Banner) ──
  async function fetchSettings() {
    const res = await fetch(`${API_BASE}/api/settings`);
    if (!res.ok) throw new Error('Failed to fetch site settings');
    return res.json();
  }

  // ── Render product cards into a container ──
  function renderProductCards(products, containerId, colClass = 'col-md-6') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <p class="text-muted">No products found in this category yet.</p>
        </div>`;
      return;
    }

    container.innerHTML = products.map(p => `
      <div class="${colClass}">
        <div class="solution-card h-100">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" class="img-fluid mb-2 rounded" loading="lazy">` : ''}
          ${p.tags ? `<p class="product-meta">${p.tags}</p>` : ''}
          <h5 class="mb-1">${p.name}</h5>
          <p class="small text-muted mb-1">${p.description}</p>
          ${p.features && p.features.length > 0 ? `
            <ul class="small text-muted mb-2">
              ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>` : ''}
          <a href="contact.html#enquiry" class="btn btn-sm btn-primary-custom">${p.enquiryLabel || 'Enquire Now'}</a>
        </div>
      </div>
    `).join('');
  }

  // ── Load products into a container (convenience wrapper) ──
  async function loadProducts(category, containerId, colClass = 'col-md-6') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Show loading state
    container.innerHTML = `
      <div class="col-12 text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-2">Loading products...</p>
      </div>`;

    try {
      const products = await fetchProducts(category);
      renderProductCards(products, containerId, colClass);
    } catch (err) {
      container.innerHTML = `
        <div class="col-12 text-center py-4">
          <p class="text-danger">Failed to load products. Please refresh the page.</p>
        </div>`;
      console.error('Error loading products:', err);
    }
  }

  // ── Load preview products for the main product.html page ──
  async function loadProductPreview(category, containerId, limit = 3, colClass = 'col-md-4') {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const products = await fetchProducts(category, limit);
      renderProductCards(products, containerId, colClass);
    } catch (err) {
      console.error('Error loading preview for', category, err);
    }
  }

  // ── Public API ──
  return {
    fetchProducts,
    fetchProduct,
    submitContact,
    fetchMedia,
    fetchServices,
    fetchSolutions,
    fetchAboutUs,
    fetchSettings,
    renderProductCards,
    loadProducts,
    loadProductPreview
  };
})();
