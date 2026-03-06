const CHAIN_DATA = {
  'רמי לוי':    { color: '#D42B0F', bg: '#FFF0EE' },
  'שופרסל':     { color: '#D42B0F', bg: '#FFF0EE' },
  'מגה':        { color: '#22A05A', bg: '#EDFAF3' },
  'ויקטורי':    { color: '#FF7A00', bg: '#FFF3E8' },
  'יינות ביתן': { color: '#7B1FA2', bg: '#F3E5F5' },
  'חצי חינם':   { color: '#D42B0F', bg: '#FFF0EE' },
  'יוחננוף':    { color: '#0288D1', bg: '#E1F5FE' },
  'אושר עד':    { color: '#388E3C', bg: '#E8F5E9' },
};

const CHAIN_SYMBOL = {
  'רמי לוי':    'RL',
  'שופרסל':     'S',
  'מגה':        'M',
  'ויקטורי':    'V',
  'יינות ביתן': 'YB',
  'חצי חינם':   '½',
  'יוחננוף':    'Y',
  'אושר עד':    'AD',
};

export default function ChainIcon({ chain, size = 36 }) {
  const data = CHAIN_DATA[chain] || { color: '#CC4A1A', bg: '#FFF0EE' };
  const symbol = CHAIN_SYMBOL[chain] || chain?.[0] || '?';
  const c = data.color;
  const r = Math.round(size * 0.28);

  return (
    <div style={{
      width: size, height: size,
      background: data.bg,
      borderRadius: r,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      border: `1.5px solid ${c}33`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cart body */}
        <path d="M7 11h3.5l3.8 13.5h12l3.2-9.5H14" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Wheels */}
        <circle cx="17.5" cy="27.5" r="1.7" fill={c}/>
        <circle cx="27" cy="27.5" r="1.7" fill={c}/>
        {/* Chain symbol */}
        <text
          x="20" y="21"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize={symbol.length > 2 ? "5.5" : "6.5"}
          fill={c}
          textAnchor="middle"
          dominantBaseline="middle"
        >{symbol}</text>
      </svg>
    </div>
  );
}

export { CHAIN_DATA };
