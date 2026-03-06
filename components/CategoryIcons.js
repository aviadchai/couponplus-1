// CategoryIcons.js — SVG vector icons for all CouponPlus categories
// Usage: <IconDeals size={15} /> — all accept size + color props

export function IconDeals({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 4-3 6-3 9.5C9 14 10.3 16 12 16s3-2 3-4.5C15 8 12 2 12 2z"/>
      <path d="M9 12c-1.5.5-3 2-3 4.5C6 19 8.5 22 12 22s6-3 6-5.5c0-2.5-1.5-4-3-4.5"/>
    </svg>
  );
}

export function IconSupermarket({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

export function IconPharm({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 3.5a4.5 4.5 0 016.36 6.36l-9.19 9.19a4.5 4.5 0 01-6.36-6.36l9.19-9.19z"/>
      <line x1="7.5" y1="7.5" x2="16.5" y2="16.5"/>
    </svg>
  );
}

export function IconBeauty({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2 5h5l-4 3 1.5 5L12 12l-4.5 3L9 10 5 7h5z"/>
      <line x1="12" y1="12" x2="12" y2="22"/>
    </svg>
  );
}

export function IconToiletries({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="3" width="8" height="18" rx="3"/>
      <path d="M8 8h8"/>
      <path d="M16 6h3v4h-3"/>
      <circle cx="12" cy="14" r="1" fill={color} stroke="none"/>
    </svg>
  );
}

export function IconElectronics({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/>
      <line x1="9" y1="6" x2="15" y2="6"/>
      <circle cx="12" cy="17" r="1" fill={color} stroke="none"/>
    </svg>
  );
}

export function IconHome({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

export function IconFashion({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-.7 3l3.08 2.59V21a1 1 0 001 1h10a1 1 0 001-1V9.05l3.08-2.59a2 2 0 00-.7-3z"/>
    </svg>
  );
}

export function IconPets({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="1.8"/>
      <circle cx="12" cy="5" r="1.8"/>
      <circle cx="17" cy="7" r="1.8"/>
      <circle cx="9.5" cy="3.5" r="1"/>
      <path d="M12 11c-3.5 0-6 2.5-6 5.5S8 21 12 21s6-1.5 6-4.5S15.5 11 12 11z"/>
    </svg>
  );
}

export function IconCouponProduct({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a2 2 0 012-2h16a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 000-4V9z"/>
      <line x1="9" y1="7" x2="9" y2="17" strokeDasharray="2 2"/>
    </svg>
  );
}

export function IconInternational({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
