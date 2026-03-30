# Video Converter Module

The video converter route is built with modular components in `components/tools/video/`.

## Public Entry

Use this import in pages:

```tsx
import {
  VideoToJpgConverter,
  VideoConverterFeatures,
  VideoConverterHowItWorks,
  VideoConverterFAQ,
  VideoConverterSeoContent,
} from "@/components/tools/video";
```

## Component Breakdown

- `video-to-jpg-converter.tsx`: Container and conversion logic
- `video-upload-card.tsx`: Drag-and-drop upload UI
- `video-preview-card.tsx`: Video preview and file info
- `video-settings-card.tsx`: Interval and JPEG quality controls
- `video-results-grid.tsx`: Extracted frame preview and download actions
- `video-converter-features.tsx`: Features section
- `video-converter-how-it-works.tsx`: Steps section
- `video-converter-faq.tsx`: FAQ section
- `video-converter-seo-content.tsx`: SEO copy section

## Notes

- Frame extraction runs fully in-browser using `HTMLVideoElement` + `canvas`.
- Object URLs are revoked on replacement and cleanup to reduce memory usage.
- The converter blocks very large extraction sets (>300 frames) and asks users to increase interval.
