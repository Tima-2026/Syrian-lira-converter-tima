import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Syrian Lira Converter',
    short_name: 'Lira Converter',
    description: 'محول الليرة السورية القديمة ↔ الجديدة | تيما',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f6f9',
    theme_color: '#0ea371',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
