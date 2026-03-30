# Dynamic Pages Setup & Usage Guide

This guide explains how to manage the new dynamic modules (Services, Solutions, About Us, and Site Settings) through the enhanced Admin Dashboard.

## 1. Services & Solutions
Both Services and Solutions operate similarly to the Media Gallery and Products.

- **Adding an Item:** Go to the respective tab, click **Add Service** or **Add Solution**.
- **Images:** You can upload an image file directly. It will be saved into the `assets/uploads/services/` or `assets/uploads/solutions/` directories.
- **Reordering:** Drag and drop the grid icon (⋮⋮) on the left side of the table rows to change the display order on the public website. The order is saved automatically.
- **Publishing:** Toggle the "Published" switch to instantly show or hide the item from the public site.

## 2. About Us
The About Us tab manages the singleton data for the `about.html` page.

- **Basic Info:** Company Name, Tagline, Mission, Vision, and Description. The Description field supports raw HTML (basic tags like `<p>`, `<strong>`, `<ul>`).
- **Stats:** You can add multiple key-value pairs (e.g., Value: "1500+", Label: "Sites completed").
- **Team Members:** Provide a **valid JSON array of objects**.
  - Example: 
    ```json
    [
      { "name": "Praveen", "designation": "Founder", "bio": "Bio goes here", "image": "assets/images/founder.jpg" }
    ]
    ```
- **Gallery Images:** Provide a list of image URLs (one per line) that will act as the background slider on the About page.

## 3. Site Settings & Global Banner
This tab controls site-wide configurations that inject the `banner.js` script onto every page.

- **WhatsApp Float:** You can provide a WhatsApp number and default message, then toggle "Enable Floating WhatsApp Button".
- **Global Banner:** If enabled, you can provide custom HTML in the "Banner HTML Content" box. This will be injected as a fixed banner at the bottom of the screen.

## Next Steps for the Administrator
Since the collections are fresh, run the seed script to initialize default content based on the original static files:
```bash
npm run seed
```
This will insert the primary About Us configuration and default Site Settings.
