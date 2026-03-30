/**
 * Seed Script — creates admin user and populates all products
 * Run: node seed.js   (or: npm run seed)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Media = require('./models/Media');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/viyu_technologies';

// ── All products extracted from the existing HTML pages ──
const products = [

  // ═══════════════════════════════════════════
  //  CCTV — Dome Cameras
  // ═══════════════════════════════════════════
  {
    name: 'Hikvision CCTV Color Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP full HD colour camera for general surveillance of shops, offices and homes.',
    image: 'assets/images/Hikvision CCTV Color Camera.jpeg',
    features: ['Digital / HD analog camera technology.', 'Approximate IR range: 20–25 m.', 'Supports day and night operation.'],
    tags: '2 MP · 20–25 m IR · Day/Night', enquiryLabel: 'Get Best Price'
  },
  {
    name: 'STQC CP PLUS IP Dome Camera 2 MP',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP IP dome camera for indoor ceilings and corridors in offices and institutes.',
    image: 'assets/images/STQC CP PLUS IP Dome Camera 2 MP.jpeg',
    features: ['IP camera with PoE support.', 'Full HD 1920 × 1080 resolution.', 'Compatible with CP PLUS and ONVIF NVRs.'],
    tags: '2 MP · IP · PoE', enquiryLabel: 'Ask CP PLUS Options'
  },
  {
    name: 'STQC CP PLUS 4 MP IP Dome Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '4 MP dome camera for detailed recording in banks, labs and critical areas.',
    image: 'assets/images/STQC CP PLUS 4 MP IP Dome Camera.jpeg',
    features: ['High resolution 4 MP image quality.', 'Suitable for sensitive and high-detail zones.', 'IR LEDs for low-light surveillance.'],
    tags: '4 MP · Dome · IR', enquiryLabel: 'Enquire 4 MP Models'
  },
  {
    name: 'UNV 2 MP Dome IP Camera IPC322LB-SF28-A',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: 'Compact UNV IP dome camera for schools, corridors and office interiors.',
    image: 'assets/images/UNV 2 MP Dome IP Camera IPC322LB-SF28-A.jpeg',
    features: ['2 MP with smart IR up to about 30 m.', 'Weather-resistant IP67 housing.', 'Supports mobile app viewing via NVR.'],
    tags: '2 MP · IP67 · Smart IR', enquiryLabel: 'Request UNV Quote'
  },
  {
    name: 'Indoor CCTV Dome Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP Hikvision wired dome camera for classrooms, offices and reception zones.',
    image: 'assets/images/Indoor CCTV Dome Camera.jpeg',
    features: ['2 MP analog camera for DVR systems.', 'Wired camera suitable for existing cabling.', 'IP65 housing with day and night vision.', 'Available in dome and bullet styles.'],
    tags: '2 MP · Dome · Indoor', enquiryLabel: 'Enquire Indoor Dome Camera'
  },
  {
    name: 'UNV 2 MP IP Dome Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP UNV IP dome camera for indoor and semi-outdoor areas such as offices and institutes.',
    image: 'assets/images/UNV 2 MP IP Dome Camera.jpeg',
    features: ['Resolution up to 1920 × 1080.', 'IP67 housing with approximately 15–25 m IR range.', 'Suitable for UNV / ONVIF NVRs.'],
    tags: '2 MP · IP · Indoor/Semi-Outdoor', enquiryLabel: 'Enquire UNV Dome Camera'
  },
  {
    name: 'Wireless Dome CCTV Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP wireless digital camera for homes and small offices where running cables is difficult.',
    image: 'assets/images/Wireless Dome CCTV Camera.jpeg',
    features: ['2 MP with day and night vision.', 'Wireless connectivity where LAN is not available.', 'Approximate IR range 15–20 m.'],
    tags: '2 MP · Wireless · 15–20 m IR', enquiryLabel: 'See Wireless Options'
  },
  {
    name: 'Godrej 2 MP Dome CCTV Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP Godrej dome CCTV camera for indoor shops, offices and homes.',
    image: 'assets/images/Godrej 2 MP Dome CCTV Camera.jpeg',
    features: ['2 MP full HD for day-to-day monitoring.', 'Approximate camera range up to 20 m (model dependent).', 'Designed for Indian market security installations.'],
    tags: '2 MP · Dome · Indoor', enquiryLabel: 'Enquire Godrej Dome Camera'
  },
  {
    name: 'Honeywell 2 MP IR Dome CCTV Camera',
    category: 'cctv', subcategory: 'Dome Cameras',
    description: '2 MP Honeywell IR dome camera for schools, hotels and retail stores.',
    image: 'assets/images/Honeywell 2 MP IR Dome CCTV Camera.jpeg',
    features: ['Full HD 1920 × 1080 with 20–25 m IR range.', '3.6 mm lens, True Day/Night and IR.', 'Cost-effective upgrade from analog to HD.'],
    tags: '2 MP · IR Dome · 20–25 m', enquiryLabel: 'Enquire Honeywell 2 MP IR Dome'
  },

  // ═══════════════════════════════════════════
  //  CCTV — Bullet Cameras
  // ═══════════════════════════════════════════
  {
    name: 'Tiandy CCTV Camera 2 MP IP Bullet',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: 'IP bullet camera for outdoor perimeters, parking areas and compound walls.',
    image: 'assets/images/Tiandy CCTV Camera 2 MP IP Bullet.jpeg',
    features: ['2 MP IP camera with fixed lens.', 'IR distance approximately 30 m.', 'Ideal for boundary and gate coverage.'],
    tags: '2 MP · IP · 30 m IR', enquiryLabel: 'Enquire for Tiandy'
  },
  {
    name: 'UNV OWL VIEW 4 MP Bullet Camera',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '4 MP ColorHunter IP bullet camera with Wise-ISP technology for full-colour images day and night.',
    image: 'assets/images/UNV OWL VIEW 4 MP Bullet Camera.jpeg',
    features: ['4 MP fixed-lens IP camera with 120 dB true WDR.', 'Warm white light up to 30 m and built-in mic.', 'Ultra 265 / H.265 / H.264 / MJPEG, PoE, IP67.'],
    tags: '4 MP · ColorHunter · IP67', enquiryLabel: 'Enquire UNV Owl View Camera'
  },
  {
    name: 'Hikvision Bullet CCTV Camera (DS-2CE1AD0T-IRP/ECO)',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '2 MP Hikvision ECO analog bullet camera for outdoor use with clear surveillance up to about 20–25 m.',
    image: 'assets/images/Hikvision Bullet CCTV Camera .jpeg',
    features: ['2 MP, 1920 × 1080 effective pixels.', 'True Day/Night with Smart IR.', 'Designed for outdoor installations.'],
    tags: '2 MP · Bullet · 20–25 m IR', enquiryLabel: 'Enquire Hikvision Bullet Camera'
  },
  {
    name: 'HD CCTV Camera',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '2 MP HD bullet camera from Hikvision for outdoor surveillance with clear day and night images.',
    image: 'assets/images/HD CCTV Camera.jpeg',
    features: ['2 MP resolution for full HD output.', 'Bullet type for outdoor mounting.', 'Approximate IR range: 20 m.'],
    tags: '2 MP · Bullet · 20 m IR', enquiryLabel: 'Get HD Camera Quote'
  },
  {
    name: 'Hikvision 2 MP Smart IP Outdoor Bullet Camera',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '2 MP Hikvision smart IP bullet camera for outdoor sites with long IR range and IP67 protection.',
    image: 'assets/images/Hkvsion 2 MP Smart IP Outdoor Bullet Camera.jpeg',
    features: ['2 MP (1920 × 1080) with day and night operation.', 'Approximate range 30–50 m.', 'H.265+ compression, DWDR, EXIR 2.0 and IP67.'],
    tags: '2 MP · Smart IP · 30–50 m IR', enquiryLabel: 'Enquire Hikvision Smart IP Bullet'
  },
  {
    name: 'HONEYWELL 5 MP STQC Bullet Camera',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '5 MP Honeywell IP fixed bullet camera with Smart IR and PoE for high-resolution outdoor security.',
    image: 'assets/images/HONEYWELL 5 MP STQC Bullet Camera.jpeg',
    features: ['5 MP camera with True WDR and 3D DNR.', 'IR range up to about 30 m, IP67 metal housing.', 'Built-in mic, ONVIF support and mobile viewing.'],
    tags: '5 MP · Bullet · Smart IR', enquiryLabel: 'Enquire Honeywell 5 MP Bullet'
  },
  {
    name: 'Dahua CCTV Camera 2 MP',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '2 MP Dahua digital CCTV camera for general security applications with full HD output and day/night operation.',
    image: 'assets/images/Dahua CCTV Camera 2 MP.jpeg',
    features: ['2 MP (1920 × 1080), 720p stream also supported.', 'Approximate IR range 15–20 m.', 'Compatible with common DVR/NVR systems.'],
    tags: '2 MP · Digital · 15–20 m IR', enquiryLabel: 'Enquire Dahua 2 MP Camera'
  },
  {
    name: 'Waterproof CCTV Bullet Camera',
    category: 'cctv', subcategory: 'Bullet Cameras',
    description: '2 MP waterproof bullet camera for outdoor areas such as gates, driveways and compound walls.',
    image: 'assets/images/Waterproof CCTV Bullet Camera.jpeg',
    features: ['2 MP full HD camera for general security use.', 'Weather-resistant housing for outdoor conditions.', 'Suitable for professional security projects.'],
    tags: '2 MP · Bullet · Waterproof', enquiryLabel: 'Enquire Waterproof Bullet Camera'
  },

  // ═══════════════════════════════════════════
  //  CCTV — 4G & Solar
  // ═══════════════════════════════════════════
  {
    name: 'TRUEVIEW 4G Dome Camera',
    category: 'cctv', subcategory: '4G & Solar Cameras',
    description: 'Compact 4G-enabled dome camera for locations without wired internet such as farms and remote offices.',
    image: 'assets/images/TRUEVIEW 4G Dome Camera.jpeg',
    features: ['Built-in 4G SIM connectivity for remote monitoring.', 'Ideal for remote sites, temporary offices and kiosks.', 'Dome form factor for ceiling or wall mounting.'],
    tags: '4G · Dome · Remote Sites', enquiryLabel: 'Enquire TRUEVIEW 4G Dome'
  },
  {
    name: 'Trueview 4G Solar Mini Pan Tilt Camera 4 MP',
    category: 'cctv', subcategory: '4G & Solar Cameras',
    description: '4 MP 4G solar-powered pan-tilt camera from Trueview for remote locations using Truecloud for monitoring.',
    image: 'assets/images/Trueview 4G Solar Mini Pan Tilt Camera 4 MP.jpeg',
    features: ['Pan-tilt rotation up to about 350°/90°.', '18,000 mAh battery with 7 W solar panel.', 'Human detection, motion tracking and Truecloud viewing.'],
    tags: '4 MP · 4G · Solar PT', enquiryLabel: 'Enquire Trueview 4G Solar PT Camera'
  },

  // ═══════════════════════════════════════════
  //  CCTV — DVR & NVR
  // ═══════════════════════════════════════════
  {
    name: 'CP Plus Digital Video Recorder',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '4-channel CP Plus HD DVR for small CCTV setups with mixed HD analog and IP cameras.',
    image: 'assets/images/CP Plus Digital Video Recorder.jpeg',
    features: ['Auto-adaptive HDCVI/AHD/TVI/CVBS signals.', 'All-channel 1080P Lite recording with H.264 compression.', '1 SATA HDD up to 6 TB and mobile app support.'],
    tags: '4 Ch · HD DVR · 1080P Lite', enquiryLabel: 'Enquire CP Plus DVR'
  },
  {
    name: 'Hikvision 32 Channel NVR 4K (2 SATA)',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '32-channel 4K NVR from Hikvision\'s AcuSense Pro Series for medium and large IP CCTV projects.',
    image: 'assets/images/Hikvision 32 Channel NVR 4K.jpeg',
    features: ['Up to 32 IP inputs with high incoming bandwidth.', 'Dual HDMI/VGA outputs and 2 SATA interfaces.', 'AcuSense AI for human/vehicle analytics and smart search.'],
    tags: '32 Ch · 4K · AcuSense', enquiryLabel: 'Enquire 32 Ch 4K NVR'
  },
  {
    name: '8 Channel Hikvision Digital Video Recorder',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '8-channel Hikvision Turbo HD DVR for small to medium CCTV setups needing 1080p Lite recording.',
    image: 'assets/images/8 Channel Hikvision Digital Video Recorder.jpeg',
    features: ['Supports HDTVI/AHD/CVI/CVBS/IP inputs.', 'H.265 Pro+/H.265 Pro/H.265/H.264+/H.264 compression.', '1-bay chassis with HDMI/VGA output and IP camera support.'],
    tags: '8 Ch · Turbo HD DVR', enquiryLabel: 'Enquire 8 Ch Hikvision DVR'
  },
  {
    name: '32 Channel Standalone DVR',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '32-channel standalone DVR made in India for large CCTV installations such as campuses and factories.',
    image: 'assets/images/32 Channel Standalone DVR.jpeg',
    features: ['Supports up to 32 camera inputs.', 'Embedded design for reliable 24×7 operation.', 'Ideal for system integrators and service providers.'],
    tags: '32 Ch · Standalone DVR', enquiryLabel: 'Enquire 32 Ch Standalone DVR'
  },
  {
    name: 'Dahua Digital Video Recorder (8 Channel)',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '8-channel Dahua DVR for small and medium CCTV systems with real-time recording and up to 4 TB HDD support.',
    image: 'assets/images/Dahua Digital Video Recorder.jpeg',
    features: ['Real-time recording on 8 channels with efficient compression.', 'Supports up to 4 TB internal HDD with low power usage.', 'Designed for 24×7 recording with remote viewing options.'],
    tags: '8 Ch · DVR · Up to 4 TB', enquiryLabel: 'Enquire Dahua 8 Ch DVR'
  },
  {
    name: 'Honeywell 4 Channel DVR (HA-DVR-2104-L)',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '4-channel 2 MP AHD Honeywell DVR for video recording over existing coax cabling.',
    image: 'assets/images/Honeywell 4 Channel DVR.jpeg',
    features: ['Supports AHD/HQA/CVI/TVI/CVBS analogue inputs.', 'H.265 dual-stream with single SATA HDD up to about 6 TB.', 'Mobile apps and smart search/playback features.'],
    tags: '4 Ch · AHD DVR · 2 MP', enquiryLabel: 'Enquire Honeywell 4 Ch DVR'
  },
  {
    name: 'Hikvision Network Video Recorder (DS-7604NI Series)',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: 'Compact Hikvision NVR for up to 4 IP cameras with full HD output, ideal for small IP installations.',
    image: 'assets/images/Hikvision Network Video Recorder.jpeg',
    features: ['Up to 4-channel IP inputs with modern compression formats.', 'Up to 40 Mbps incoming bandwidth and full HD display.', 'Supports remote viewing on smartphones and PCs.'],
    tags: '4 Ch · NVR · H.265+', enquiryLabel: 'Enquire Hikvision NVR'
  },
  {
    name: 'Digital Video Recorder (4 Channel, 2 MP)',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '4-channel 2 MP DVR for medium-sized CCTV systems with full HD recording.',
    image: 'assets/images/Digital Video Recorder.jpeg',
    features: ['Supports 4 camera channels up to 2 MP each.', 'Designed for continuous 24×7 operation.', 'Suitable for basic security applications.'],
    tags: '4 Ch · DVR · 2 MP', enquiryLabel: 'Enquire 4 Ch Digital Video Recorder'
  },
  {
    name: 'Hikvision 16 Channel Turbo HD DVR',
    category: 'cctv', subcategory: 'DVR & NVR Recorders',
    description: '16-channel Hikvision Turbo HD DVR for full HD 1080 recording with hybrid camera support.',
    image: 'assets/images/Hikvision 16 Channel Turbo HD DVR.jpeg',
    features: ['Supports Turbo HD/AHD/HDCVI/CVBS and IP inputs.', 'H.264/H.264+ compression with full-channel playback.', 'Single SATA slot up to 6 TB in compact 1U chassis.'],
    tags: '16 Ch · Turbo HD DVR', enquiryLabel: 'Enquire 16 Ch Hikvision Turbo HD DVR'
  },

  // ═══════════════════════════════════════════
  //  FIRE ALARM
  // ═══════════════════════════════════════════
  {
    name: '2 Zone Conventional Fire Alarm Panel',
    category: 'fire', subcategory: 'Fire Alarm Panels',
    description: 'Compact 2-zone conventional fire alarm control panel for small sites like shops, offices and small school.',
    image: 'assets/images/2 Zone Conventional Fire Alarm Panel.jpeg',
    features: ['Supports 2 detector zones with separate fire and fault indications.', 'Dedicated sounder circuits and class change input for school bell integration.', 'Ideal starter panel for up to a few thousand square feet.'],
    tags: '2 Zone · Conventional · Small sites', enquiryLabel: 'Enquire 2 Zone Panel'
  },
  {
    name: '4 Zone Conventional Fire Alarm Panel',
    category: 'fire', subcategory: 'Fire Alarm Panels',
    description: '4-zone conventional fire alarm panel for mid-size buildings with multiple floors or blocks.',
    image: 'assets/images/4 Zone Conventional Fire Alarm Panel.jpeg',
    features: ['Up to 20 detectors per zone with separate zone LEDs and controls.', 'Alarm and fault relays for interfacing with suppression systems or BMS.', 'Suitable for schools, hostels, warehouses and commercial offices.'],
    tags: '4 Zone · Conventional · Mid-size', enquiryLabel: 'Get 4 Zone Panel Quote'
  },
  {
    name: '8 Zone Conventional Fire Alarm Panel',
    category: 'fire', subcategory: 'Fire Alarm Panels',
    description: '8-zone fire alarm panel for larger premises requiring zoning and easier fault location.',
    image: 'assets/images/8 Zone Conventional Fire Alarm Panel.jpeg',
    features: ['Supports networking with multiple panels and repeater panels.', 'Selectable twin-wire zones and programmable sounder outputs.', 'Best suited for factories, hospitals and large educational campuses.'],
    tags: '8 Zone · Conventional · Large sites', enquiryLabel: 'Enquire 8 Zone Panel'
  },
  {
    name: 'Conventional Smoke Detector',
    category: 'fire', subcategory: 'Detectors',
    description: 'Ceiling-mounted optical smoke detector for early detection of smouldering fires.',
    image: 'assets/images/Conventional Smoke Detector.jpeg',
    features: ['Compatible with most conventional fire alarm panels.', 'LED indication for alarm, suitable for offices, classrooms and corridors.', 'Low current consumption and easy twist-lock mounting base.'],
    tags: 'Smoke · Ceiling · Optical', enquiryLabel: 'Ask for Smoke Detector'
  },
  {
    name: 'Conventional Heat Detector',
    category: 'fire', subcategory: 'Detectors',
    description: 'Fixed-temperature / rate-of-rise heat detector for kitchens, generator rooms and dusty areas.',
    image: 'assets/images/Conventional Heat Detector.jpeg',
    features: ['Resistant to dust and fumes where smoke detectors may give false alarms.', 'Compatible with standard conventional detection loops.', 'LED alarm indicator with 360-degree visibility.'],
    tags: 'Heat · Fixed / ROR · Harsh areas', enquiryLabel: 'Enquire Heat Detector'
  },
  {
    name: 'Response Indicator',
    category: 'fire', subcategory: 'Detectors',
    description: 'Twin-LED response indicator for detectors installed inside false ceilings or hidden areas.',
    image: 'assets/images/Response Indicator.jpeg',
    features: ['Flush-mount indicator shows which hidden detector is in alarm.', 'Used along with smoke/heat detectors in lift lobbies and ceiling voids.', 'Low-current LED design for conventional loops.'],
    tags: 'Twin LED · Hidden detectors', enquiryLabel: 'Ask for Response Indicator'
  },
  {
    name: 'Manual Call Point (Break Glass MCP)',
    category: 'fire', subcategory: 'MCP & Hooters',
    description: 'Wall-mounted red manual call point for raising fire alarm manually by pressing the glass.',
    image: 'assets/images/Manual Call Point.jpeg',
    features: ['Designed for 18–26 V DC conventional fire alarm loops.', 'Metal or ABS housing options for indoor and semi-outdoor use.', 'Used near exits, staircases and critical plant areas.'],
    tags: 'MCP · Break glass · Wall', enquiryLabel: 'Get MCP Options'
  },
  {
    name: 'Combined MCP with Hooter',
    category: 'fire', subcategory: 'MCP & Hooters',
    description: 'Integrated manual call point with built-in hooter for quick alarm and sound at one location.',
    image: 'assets/images/Combined MCP with Hooter.jpeg',
    features: ['MS housing with high-intensity local sounder for immediate evacuation.', 'Operates on 24 V DC fire alarm supply with low current consumption.', 'Useful at main gates, reception and security cabins.'],
    tags: 'MCP + Hooter · Local alarm', enquiryLabel: 'Enquire MCP + Hooter'
  },
  {
    name: 'Fire Alarm Hooter / Sounder',
    category: 'fire', subcategory: 'MCP & Hooters',
    description: 'Electronic fire alarm hooter / sounder for loud evacuation alarm during fire events.',
    image: 'assets/images/Fire Alarm Hooter.jpeg',
    features: ['24 V DC operation with high dB output for indoor corridors and halls.', 'ABS or MS housing with wall-mount enclosure.', 'Can be used with flashing strobe for higher visibility.'],
    tags: 'Hooter · 24 V DC · High dB', enquiryLabel: 'Ask for Hooter Models'
  },
  {
    name: 'Fire Alarm Strobe Light',
    category: 'fire', subcategory: 'MCP & Hooters',
    description: 'Red flasher / strobe light for visual fire indication, useful in noisy areas.',
    image: 'assets/images/Fire Alarm Strobe Light.jpeg',
    features: ['High-brightness LED strobe with low power consumption.', 'Works with conventional fire alarm panels on 24 V DC circuits.', 'Recommended for factories, workshops and parking basements.'],
    tags: 'Strobe · Visual alert · Noisy areas', enquiryLabel: 'Enquire Strobe Light'
  },
  {
    name: 'Fire Alarm Cables & Accessories',
    category: 'fire', subcategory: 'Cables & Accessories',
    description: 'FRLS / fire survival cables, junction boxes and accessories for complete fire alarm installation.',
    image: 'assets/images/Fire Alarm Cables & Accessories.jpeg',
    features: ['FRLS copper cables sized as per panel and device load.', 'Metal and plastic junction boxes, glands and markers.', 'Suitable for new installation and retrofitting projects.'],
    tags: 'FRLS / FS cables · Accessories', enquiryLabel: 'Share Fire Cabling Requirement'
  },

  // ═══════════════════════════════════════════
  //  BIOMETRIC & ACCESS
  // ═══════════════════════════════════════════
  {
    name: 'Fingerprint Time Attendance Machine',
    category: 'biometric', subcategory: 'Attendance Devices',
    description: 'Biometric fingerprint time-attendance device for small and medium offices.',
    image: 'assets/images/Fingerprint Time Attendance Machine.jpeg',
    features: ['Supports fingerprint, RFID card and PIN authentication.', 'Stores thousands of users and attendance logs with fast matching speed.', 'Connectivity via TCP/IP and USB for data download to software.'],
    tags: 'Fingerprint · Card · PIN', enquiryLabel: 'Enquire Fingerprint Machine'
  },
  {
    name: 'Face + Fingerprint Attendance Device',
    category: 'biometric', subcategory: 'Attendance Devices',
    description: 'Multi-biometric time-attendance terminal with face, fingerprint and card for higher security.',
    image: 'assets/images/Face + Fingerprint Attendance Device.jpeg',
    features: ['Face capacity up to a few thousand templates with fast recognition speed.', 'Optional fingerprint and RFID card support for multi-factor authentication.', 'IP-based connectivity, TCP/IP, USB and optional Wi-Fi for real-time syncing.'],
    tags: 'Face · Fingerprint · Card', enquiryLabel: 'Get Face Device Options'
  },
  {
    name: 'RFID Card Time Attendance Reader',
    category: 'biometric', subcategory: 'Attendance Devices',
    description: 'Proximity card-based time attendance terminal for schools and visitor tracking.',
    image: 'assets/images/RFID Card Time Attendance Reader.jpeg',
    features: ['Supports RFID cards and PIN with simple one-tap punch.', 'Ideal where biometric data is not preferred but tracking is required.', 'Connects to PC software over LAN for reports and exports.'],
    tags: 'RFID card · PIN', enquiryLabel: 'Enquire RFID Attendance'
  },
  {
    name: 'Face Recognition Terminal (Wi-Fi)',
    category: 'biometric', subcategory: 'Attendance Devices',
    description: 'Touchscreen face attendance device with Wi-Fi for contactless punching and remote branches.',
    image: 'assets/images/Face Recognition Terminal.jpeg',
    features: ['Face capacity typically 3,000–5,000 users with <1 second identification.', 'TCP/IP, USB and Wi-Fi communication for cloud or local server integration.', 'Useful for schools, canteens and offices needing hygienic, touch-free attendance.'],
    tags: 'Face · Wi-Fi · Touchscreen', enquiryLabel: 'Enquire Face Attendance'
  },
  {
    name: 'Aadhaar Enabled Biometric Attendance Device',
    category: 'biometric', subcategory: 'Attendance Devices',
    description: 'STQC-certified fingerprint or face device suitable for Aadhaar-based government attendance portals.',
    image: 'assets/images/Aadhaar Enabled Biometric Attendance Device.jpeg',
    features: ['STQC-approved L1 sensor and UIDAI-compliant extractor / RD service.', 'Integrated with cloud-based biometric attendance software and dashboards.', 'Used in govt offices, institutions and PSU locations as per AEBAS guidelines.'],
    tags: 'AEBAS · STQC · Govt', enquiryLabel: 'Ask for AEBAS Devices'
  },
  {
    name: 'Outdoor Waterproof Fingerprint Reader',
    category: 'biometric', subcategory: 'Access Control Devices',
    description: 'IP-rated fingerprint and card access terminal for outdoor gates and turnstiles.',
    image: 'assets/images/Outdoor Waterproof Fingerprint Reader.jpeg',
    features: ['Capacity up to around 3,000 fingerprints and 30,000 cards with 100,000 logs.', 'Access-control I/O for electric locks, door sensors and exit buttons.', 'Designed for harsh environments with weatherproof housing.'],
    tags: 'Outdoor · IP-rated · Card + FP', enquiryLabel: 'Ask Outdoor Biometric Options'
  },
  {
    name: 'Biometric Access Control Unit',
    category: 'biometric', subcategory: 'Access Control Devices',
    description: 'Fingerprint / card based door access controller with EM lock kit for main doors.',
    image: 'assets/images/Biometric Access Control Unit.jpeg',
    features: ['Supports fingerprint, card and PIN with anti-passback features.', 'Relay outputs for EM locks, door sensor, exit switch and alarm.', 'Can be combined with time-attendance software for in/out reports.'],
    tags: 'Door access · EM lock kit', enquiryLabel: 'Ask Access Control Package'
  },
  {
    name: 'USB Fingerprint Scanner',
    category: 'biometric', subcategory: 'Portable / USB Biometric',
    description: 'Compact USB fingerprint reader for attendance, visitor and PC login applications.',
    image: 'assets/images/USB Fingerprint Scanner.jpeg',
    features: ['Connects directly to PC / laptop for custom attendance or application login.', 'Supported by many Indian attendance and Aadhaar applications.', 'Ideal for kiosks, counters and small offices.'],
    tags: 'USB · Desktop · Scanner', enquiryLabel: 'Enquire USB Scanner'
  },
  {
    name: 'Wi-Fi Biometric Tablet Attendance',
    category: 'biometric', subcategory: 'Portable / USB Biometric',
    description: 'Android tablet-based biometric terminal with fingerprint sensor and large touch screen.',
    image: 'assets/images/Wi‑Fi Biometric Tablet Attendance.jpeg',
    features: ['7-inch touch display with built-in fingerprint sensor and camera.', 'LAN, Wi-Fi, 3G/4G and GPS options for field or vehicle attendance.', 'Ideal for construction sites, field staff and project-based deployments.'],
    tags: 'Android tablet · Wi-Fi · GPS', enquiryLabel: 'Enquire Tablet Attendance'
  },
  {
    name: 'Biometric Attendance Software & Reports',
    category: 'biometric', subcategory: 'Biometric Software',
    description: 'Centralized time-attendance software for multiple devices, locations and shifts.',
    image: 'assets/images/Biometric Attendance Software & Reports.jpeg',
    features: ['Real-time data sync, shift scheduling and leave management.', 'Exports to payroll in Excel, CSV or integration with HRMS.', 'Supports web dashboard and mobile app attendance view.'],
    tags: 'Multi-location · Shifts · Reports', enquiryLabel: 'Discuss Attendance Software'
  },

  // ═══════════════════════════════════════════
  //  PA SYSTEM
  // ═══════════════════════════════════════════
  {
    name: '120W PA Mixer Amplifier',
    category: 'pa', subcategory: 'PA Mixer & Power Amplifiers',
    description: '120 W public address mixer amplifier for small to medium buildings and floor-wise zoning.',
    image: 'assets/images/120W PA Mixer Amplifier.jpeg',
    features: ['Multiple mic and AUX inputs with individual volume control.', '70 V / 100 V line and 4–16 Ω speaker outputs for flexible wiring.', 'Ideal for schools, offices, temples and showrooms.'],
    tags: '120 W · Mixer amp · 100 V line', enquiryLabel: 'Enquire 120W Mixer Amp'
  },
  {
    name: '250W Public Address Power Amplifier',
    category: 'pa', subcategory: 'PA Mixer & Power Amplifiers',
    description: 'High-power 240–250 W class-D PA power amplifier for large halls and outdoor speakers.',
    image: 'assets/images/250W Public Address Power Amplifie.jpeg',
    features: ['Supports 100 V line and low-impedance speaker outputs.', 'Short-circuit, overload and temperature protection for 24×7 use.', 'Used with mixer or paging console for multi-zone PA systems.'],
    tags: '240–250 W · Power amp · 100 V', enquiryLabel: 'Get High Power Amp Quote'
  },
  {
    name: 'Multi-Zone Mixer Amplifier',
    category: 'pa', subcategory: 'PA Mixer & Power Amplifiers',
    description: 'Mixer amplifier with multiple speaker zone outputs for floor-wise volume control.',
    image: 'assets/images/Multi‑Zone Mixer Amplifier.webp',
    features: ['Selectable zone buttons and master volume with bass/treble.', 'Supports mic, line and music inputs for BGM and paging.', 'Ideal for schools, malls, hotels and office complexes.'],
    tags: 'Multi-zone · Mixer amp', enquiryLabel: 'Get Multi-Zone PA Quote'
  },
  {
    name: 'Rack Mount Audio Mixer',
    category: 'pa', subcategory: 'PA Mixer & Power Amplifiers',
    description: '6–9 channel rack-mount audio mixer for combining microphones and music sources.',
    image: 'assets/images/Rack Mount Audio Mixer.webp',
    features: ['Multiple balanced mic inputs with phantom power (model-dependent).', 'Aux and USB/Bluetooth inputs for background music.', 'Feeds one or more PA power amplifiers for large systems.'],
    tags: '6–9 ch · Rack mixer', enquiryLabel: 'Ask for Mixer Options'
  },
  {
    name: '6W Ceiling Speaker (100V Line)',
    category: 'pa', subcategory: 'PA Speakers',
    description: '6 W, 100 V line ceiling speaker for clear paging and background music in corridors and offices.',
    image: 'assets/images/6w-in-line-100v-ceiling-speakers.webp',
    features: ['6 inch full-range driver with tapping options like 1.5/3/6 W.', 'Flush-mount design with metal grille blends into false ceilings.', 'Suitable for offices, hospitals, retail and educational buildings.'],
    tags: '6 W · 100 V · Ceiling', enquiryLabel: 'Enquire Ceiling Speakers'
  },
  {
    name: 'Wall Mount PA Speaker',
    category: 'pa', subcategory: 'PA Speakers',
    description: '15–30 W wall mount speaker for classrooms, prayer halls and meeting rooms.',
    image: 'assets/images/Wall Mount PA Speaker.webp',
    features: ['Wide frequency response for speech and background music.', 'Available in 100 V line models for long cable runs.', 'Horizontal or vertical mounting bracket for easy aiming.'],
    tags: '15–30 W · Wall-mount', enquiryLabel: 'Ask Wall Speaker Options'
  },
  {
    name: 'Outdoor Horn Speaker',
    category: 'pa', subcategory: 'PA Speakers',
    description: 'Weather-resistant horn-loaded loudspeaker for outdoor announcements like yards and playgrounds.',
    image: 'assets/images/Outdoor Horn Speaker.webp',
    features: ['High SPL and wide dispersion for long-distance voice coverage.', 'Suitable for 70/100 V line PA systems with power taps.', 'Ideal for campuses, factories and parking areas.'],
    tags: 'Horn · Outdoor · 100 V', enquiryLabel: 'Enquire Horn Speakers'
  },
  {
    name: 'Portable Wireless PA System',
    category: 'pa', subcategory: 'PA Speakers',
    description: 'Battery-powered portable PA speaker with wireless mic, Bluetooth and USB/SD playback.',
    image: 'assets/images/Portable Wireless PA System.webp',
    features: ['Ideal for small gatherings, classrooms and training sessions.', 'Built-in rechargeable battery, Bluetooth, FM and recording options (model-dependent).', 'Lightweight cabinet with shoulder strap or trolley design.'],
    tags: 'Portable · Wireless · Battery', enquiryLabel: 'Enquire Portable PA'
  },
  {
    name: 'Paging Microphone with Chime',
    category: 'pa', subcategory: 'Paging Microphones',
    description: 'Gooseneck paging microphone with call-bell chime for clear announcements from reception or control room.',
    image: 'assets/images/Paging Microphone with Chime.webp',
    features: ['Unidirectional dynamic capsule for better speech clarity.', 'Push-to-talk switch and chime function to grab attention.', 'Balanced output to drive mixer or system controller.'],
    tags: 'Gooseneck · Chime · Desk', enquiryLabel: 'Enquire Paging Mic'
  },
  {
    name: 'PA Cables & Installation Accessories',
    category: 'pa', subcategory: 'PA Cables & Accessories',
    description: 'Speaker cables, rack hardware and connectors required for complete PA installations.',
    image: 'assets/images/PA Cables & Installation Accessories.webp',
    features: ['100 V line rated copper speaker cables for long-distance runs.', 'Racks, patch panels and wall plates for neat installation.', 'Used in schools, factories, stations and public buildings.'],
    tags: '100 V line cable · Racks · Plates', enquiryLabel: 'Share PA Wiring Requirement'
  },

  // ═══════════════════════════════════════════
  //  GPS TRACKING
  // ═══════════════════════════════════════════
  {
    name: 'Vehicle GPS Units',
    category: 'gps', subcategory: 'Vehicle Trackers',
    description: 'Wired GPS devices installed in buses, cars and trucks for live tracking.',
    image: 'assets/images/vehicalgps.jpeg',
    features: ['Ignition, speed and location monitoring.', 'SIM/data plan-based connectivity.', 'Reports via web and mobile apps.'],
    tags: 'Vehicle · Wired · Live tracking', enquiryLabel: 'Ask Device Options'
  },
  {
    name: 'OBD Plug-in GPS Trackers',
    category: 'gps', subcategory: 'Vehicle Trackers',
    description: 'Compact GPS units that plug into the vehicle OBD port for quick deployment.',
    image: 'assets/images/OBD Plug‑in GPS Trackers.webp',
    features: ['Ideal for cars and light commercial vehicles.', 'No wiring cut, non-intrusive installation.', 'Real-time tracking and trip history.'],
    tags: 'OBD · Plug-in · No wiring', enquiryLabel: 'Check OBD Compatibility'
  },
  {
    name: 'School Bus GPS Solutions',
    category: 'gps', subcategory: 'Vehicle Trackers',
    description: 'AIS-140 compliant GPS units for school buses with safety alerts and reports.',
    image: 'assets/images/School Bus GPS Solutions.webp',
    features: ['Geo-fencing, over-speed, and route deviation alerts.', 'Supports RFID-based student boarding logs.', 'Parent app notifications for pickup/drop.'],
    tags: 'School bus · AIS-140 · RFID', enquiryLabel: 'Share Route Details'
  },
  {
    name: 'Asset & Portable Trackers',
    category: 'gps', subcategory: 'Asset Trackers',
    description: 'Compact battery-powered GPS devices for containers, generators and movable assets.',
    image: 'assets/images/Asset & Portable Trackers.webp',
    features: ['Long backup with configurable tracking interval.', 'Suitable for high-value asset monitoring.', 'Web and app dashboard for alerts and history.'],
    tags: 'Asset · Battery · Portable', enquiryLabel: 'Share Asset Details'
  },
  {
    name: 'Fleet Management Solutions',
    category: 'gps', subcategory: 'Fleet Management',
    description: 'End-to-end fleet dashboard for trucks, buses and cars with analytics and reports.',
    image: 'assets/images/Fleet Management Solutions.webp',
    features: ['Driver behavior, idling and fuel trend reports.', 'Geo-fences, trip planning and route optimization.', 'Role-based logins for owners and managers.'],
    tags: 'Fleet · Dashboard · Analytics', enquiryLabel: 'Request Fleet Demo'
  },

  // ═══════════════════════════════════════════
  //  IT & LAPTOPS
  // ═══════════════════════════════════════════
  {
    name: 'Business Series Laptops',
    category: 'it', subcategory: 'Laptops',
    description: 'Refurbished branded laptops suitable for office work and online classes.',
    image: 'assets/images/BusinessSeriesLaptops.jpeg',
    features: ['Core i5 / i7, SSD options and 8GB+ RAM variants.', 'Warranty on hardware for defined period.', 'Bulk quantity support for labs and offices.'],
    tags: 'Business · Refurbished · i5/i7', enquiryLabel: 'Enquire Now'
  },
  {
    name: 'Student & Entry-Level Laptops',
    category: 'it', subcategory: 'Laptops',
    description: 'Budget-friendly systems for students and basic office usage.',
    image: 'assets/images/Student&Entry-LevelLaptops.jpeg',
    features: ['Configured for browsing, office apps and online classes.', 'Available in limited-time lots.', 'Accessories bundle options (mouse, bag, headset).'],
    tags: 'Student · Budget · Entry-level', enquiryLabel: 'Get Current Offers'
  },
  {
    name: 'Accessories & Networking',
    category: 'it', subcategory: 'Accessories',
    description: 'Essential accessories and networking hardware for your setup.',
    image: 'assets/images/accesssories.jpg',
    features: ['Keyboards, mice, routers, switches, Wi-Fi devices.', 'Patch cords, racks and related items.', 'Supply with or without installation support.'],
    tags: 'Peripherals · Networking · Accessories', enquiryLabel: 'Share Accessory List'
  },

  // ═══════════════════════════════════════════
  //  BOOM BARRIERS & TYRE KILLERS
  // ═══════════════════════════════════════════
  {
    name: 'Automatic Boom Barriers',
    category: 'boom-tyre', subcategory: 'Boom Barriers',
    description: 'Motorised boom barriers for vehicle entry and exit control at gates and checkpoints.',
    image: 'assets/images/boombarrier.jpeg',
    features: ['Integration with RFID tags, ANPR and access control.', 'Options for medium and heavy duty operation.', 'Manual release in power failure conditions.'],
    tags: 'Boom · Motorised · RFID', enquiryLabel: 'Share Gate Width'
  },
  {
    name: 'Road Blockers & Tyre Killers',
    category: 'boom-tyre', subcategory: 'Tyre Killers',
    description: 'Heavy-duty spike barriers designed to stop unauthorised or high-speed vehicles.',
    image: 'assets/images/Road Blockers & Tyre Killers.webp',
    features: ['Surface and flush mount models for different sites.', 'Suitable for embassies, data centres and high-risk zones.', 'Interfaces with boom barriers and security systems.'],
    tags: 'Road blocker · Spike · High security', enquiryLabel: 'Discuss Security Level'
  },

  // ═══════════════════════════════════════════
  //  BOLLARDS & GATE MOTORS
  // ═══════════════════════════════════════════
  {
    name: 'Hydraulic / Automatic Bollards',
    category: 'bollards-gate', subcategory: 'Bollards',
    description: 'Rising bollards to secure driveways and sensitive perimeters.',
    image: 'assets/images/Hydraulic Automatic Bollards.webp',
    features: ['Single and multiple bollard configurations.', 'Suitable for commercial and institutional entry points.', 'Can be linked with access cards and controllers.'],
    tags: 'Hydraulic · Rising · Automatic', enquiryLabel: 'Share Traffic Pattern'
  },
  {
    name: 'Sliding & Swing Gate Motors',
    category: 'bollards-gate', subcategory: 'Gate Motors',
    description: 'Motors for existing sliding and swing gates with remote/app control.',
    image: 'assets/images/Sliding & Swing Gate Motors.webp',
    features: ['Rated for frequent opening cycles for societies and campuses.', 'Supports safety sensors and manual override.', 'Integration with intercom and access systems.'],
    tags: 'Sliding · Swing · Motor', enquiryLabel: 'Check Gate Compatibility'
  },

  // ═══════════════════════════════════════════
  //  SIGNAL BOOSTER & NETWORKING
  // ═══════════════════════════════════════════
  {
    name: 'Mobile Signal Boosters',
    category: 'signal-network', subcategory: 'Signal Boosters',
    description: 'Multi-band boosters to improve indoor mobile coverage in low signal areas.',
    image: 'assets/images/Mobile Signal Boosters.webp',
    features: ['Solutions for homes, basements and multi-floor buildings.', 'Supports major telecom operators.', 'Site survey and installation support.'],
    tags: 'Multi-band · Indoor · Booster', enquiryLabel: 'Request Signal Survey'
  },
  {
    name: 'LAN & Wi-Fi Networking',
    category: 'signal-network', subcategory: 'Networking',
    description: 'Switching, routing and Wi-Fi solutions for wired and wireless networks.',
    image: 'assets/images/LAN & Wi‑Fi Networking.webp',
    features: ['Managed/unmanaged switches, routers and Wi-Fi access points.', 'Rack, cabling and patch panel setups.', 'Design, configuration and maintenance services.'],
    tags: 'LAN · Wi-Fi · Switches', enquiryLabel: 'Share Network Requirement'
  },

  // ═══════════════════════════════════════════
  //  INTERCOM & EPABX
  // ═══════════════════════════════════════════
  {
    name: 'Digital / IP EPABX',
    category: 'intercom-epabx', subcategory: 'EPABX',
    description: 'Small to medium capacity EPABX for office and campus communication.',
    image: 'assets/images/Digital  IP EPABX.webp',
    features: ['Analog and IP extensions in a single system.', 'Features like IVR, call transfer and conferencing.', 'Expandable models for future growth.'],
    tags: 'EPABX · IP · Analog', enquiryLabel: 'Share No. of Lines'
  },
  {
    name: 'Society & Campus Intercom',
    category: 'intercom-epabx', subcategory: 'Intercom',
    description: 'Intercom solutions for apartments, hostels and educational campuses.',
    image: 'assets/images/Society & Campus Intercom.webp',
    features: ['Audio intercom between flats, gate and security cabin.', 'Support for expansion blocks and towers.', 'Wired and IP-based options available.'],
    tags: 'Society · Campus · Audio', enquiryLabel: 'Share Building Layout'
  },

  // ═══════════════════════════════════════════
  //  SMART CLASS & DIGITAL SIGNAGE
  // ═══════════════════════════════════════════
  {
    name: 'Smart Class Solutions',
    category: 'smart-digital', subcategory: 'Smart Class',
    description: 'Interactive panels/projectors with audio systems and content for digital classrooms.',
    image: 'assets/images/Smart Class Solutions.webp',
    features: ['Ideal for schools, colleges and coaching centres.', 'Teacher-friendly software and training support.', 'End-to-end installation and maintenance.'],
    tags: 'Interactive · Panel · Education', enquiryLabel: 'Share Classroom Count'
  },
  {
    name: 'Digital Signage Displays',
    category: 'smart-digital', subcategory: 'Digital Signage',
    description: 'Centralised content-managed displays for notices, branding and wayfinding on campus.',
    image: 'assets/images/digitalsignage.jpeg',
    features: ['Standees, wall-mount and ceiling-mount displays.', 'Cloud content management for multiple screens.', 'Use for announcements, timetables and campaigns.'],
    tags: 'Signage · Cloud · Display', enquiryLabel: 'Share Display Locations'
  }
];

// ── Sample Media Items ──
const sampleMedia = [
  {
    title: 'Corporate Office Surveillance Setup',
    type: 'photo',
    url: 'assets/images/carporate.jpeg',
    category: 'CCTV Projects',
    siteLocation: 'Lucknow',
    isPublished: true,
    order: 0
  },
  {
    title: 'Fire Panel Installation Demo',
    type: 'photo',
    url: 'assets/images/FIRE.jpg',
    category: 'Fire Safety',
    siteLocation: 'Kanpur',
    isPublished: true,
    order: 1
  },
  {
    title: 'Smart Home Automation Teaser',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: 'assets/images/loop3.jpg',
    category: 'Home Automation',
    siteLocation: 'Delhi NCR',
    isPublished: true,
    order: 2
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Create admin user ──
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingUser = await User.findOne({ username: adminUsername });
    if (existingUser) {
      console.log(`ℹ️  Admin user "${adminUsername}" already exists — skipping.`);
    } else {
      await User.create({ username: adminUsername, password: adminPassword });
      console.log(`✅ Created admin user: ${adminUsername}`);
    }

    // ── Seed products ──
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} products already exist. Skipping product seed.`);
      console.log('   To re-seed, drop the products collection first:');
      console.log('   db.products.drop()  (in mongo shell)');
    } else {
      await Product.insertMany(products);
      console.log(`✅ Seeded ${products.length} products across all categories.`);
    }

    // ── Seed Media ──
    const mediaCount = await Media.countDocuments();
    if (mediaCount > 0) {
      console.log(`ℹ️  ${mediaCount} media items already exist. Skipping media seed.`);
    } else {
      await Media.insertMany(sampleMedia);
      console.log(`✅ Seeded ${sampleMedia.length} sample media items.`);
    }

    console.log('\n🎉 Seed complete! You can now start the server with: npm run dev');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
