# BEULA AUDIO — Mobile Background Video Handoff Specification

On mobile devices (<1024px), BEULA AUDIO swaps the heavy Three.js WebGL canvas for an optimized, high-impact background video to deliver 60 FPS performance, preserve battery life, and provide instant visual drama.

---

## 1. Video Specifications

| Parameter | Recommended Specification | Acceptable Range |
| :--- | :--- | :--- |
| **Container & Codec** | **MP4 (H.264 / AVC, Baseline or Main Profile)** | MP4 (H.264) |
| **Resolution** | **1080 × 1920** (9:16 Vertical Portrait) | 720 × 1280 to 1080 × 1920 |
| **Frame Rate** | **30 fps** (or 24 fps cinematic) | 24 - 30 fps |
| **Bitrate** | **2.5 Mbps - 3.5 Mbps** (VBR 2-Pass) | Maximum 4.5 Mbps |
| **Target File Size** | **4 MB - 8 MB** | Do not exceed 10 MB |
| **Duration** | **8 - 14 seconds** (Seamless Loop) | 6 - 18 seconds |
| **Audio Track** | **None** (Strip audio track in export) | Muted |

---

## 2. Visual Content & Composition Guidelines

1. **Content**:
   - Slow, cinematic panning across lit event sound equipment, moving beam lights cutting through atmospheric haze, bass speaker cones pulsing, or DJ booth glow.
   - Avoid fast cuts or strobe-heavy editing which distracts from reading package titles and pricing.
2. **Safe Areas**:
   - **Top 15%**: Reserved for floating brand header and status bar.
   - **Bottom 25%**: Reserved for the interactive package cards and "CHECK AVAILABILITY" CTA button.
   - **Center 60%**: Main focal region for equipment imagery.
3. **Contrast**:
   - The video is overlaid with a subtle dark linear gradient (`rgba(5, 5, 6, 0.6)`) to ensure ivory typography retains WCAG AAA contrast ratio.

---

## 3. Poster Image Fallback

A matching still frame is mandatory to eliminate layout shift and provide an instant visual before the video buffer initiates:

- **File Path**: `public/videos/mobile-hero-poster.webp` (or `.jpg`)
- **Resolution**: Same as video (`1080 × 1920`)
- **Format**: WebP (quality 85) or progressive JPEG
- **Max File Size**: Under **200 KB**

---

## 4. File Placement in Project

Place your exported assets in:
```
public/
  videos/
    mobile-hero.mp4           <-- Primary background video
    mobile-hero-poster.webp    <-- First frame poster fallback
```

---

## 5. Mobile Browser Autoplay Requirements

The HTML `<video>` implementation adheres to iOS Safari and Android Chrome strict autoplay policies:
```html
<video
  src="/videos/mobile-hero.mp4"
  poster="/videos/mobile-hero-poster.webp"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
/>
```
*(Note: Videos with an active unmuted audio track will be blocked by mobile operating systems.)*
