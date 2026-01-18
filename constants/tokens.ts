// constants/tokens.ts
export type ColorTokens = {
  primary: {
    purple: string;
    midnight: string;
  };
  surface: {
    background: string;
    card: string;
    imageWell: string;
  };
  text: {
    primary: string;
    muted: string;
    placeholder: string;
    onPrimary: string;
  };
  icon: {
    muted: string;
  };
  tabbar: {
    background: string;
    border: string;
  };
  status: {
    error: string;
  };
};

export type Tokens = {
  color: ColorTokens;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;

    screen: number;
    grid: number;
    cardPadding: number;
    cardContentGap: number;
    searchPaddingX: number;
    searchPaddingY: number;

    sectionGap: number;
    titleToGrid: number;
  };
  radius: {
    sm: number;
    md: number;
    pill: number;
  };
  typography: {
    family: {
      base: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
      black: string;
      heading: string;
      cabinetRegular: string;
    };
    size: {
      title: number;
      body: number;
      badge: number;
      tabLabel: number;
    };
    lineHeight: {
      body: number;
      title: number;
    };
  };
  shadow: {
    soft: {
      shadowColor: string;
      shadowOpacity: number;
      shadowRadius: number;
      shadowOffset: { width: number; height: number };
      elevation: number;
    };
  };

  // (je detail tokens laat ik staan zoals jij ze had)
  detail: unknown; // ✅ was any
};

const base = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,

    screen: 24,
    grid: 16,
    cardPadding: 12,
    cardContentGap: 10,
    searchPaddingX: 16,
    searchPaddingY: 12,

    sectionGap: 32,
    titleToGrid: 16,
  },
  radius: {
    sm: 4,
    md: 8,
    pill: 999,
  },
  typography: {
    family: {
      base: 'Rubik_400Regular',
      regular: 'Rubik_400Regular',
      medium: 'Rubik_500Medium',
      semibold: 'Rubik_600SemiBold',
      bold: 'Rubik_700Bold',
      black: 'Rubik_900Black',
      heading: 'CabinetGrotesk-Extrabold',
      cabinetRegular: 'CabinetGrotesk-Regular',
    },
    size: {
      title: 24,
      body: 16,
      badge: 12,
      tabLabel: 12,
    },
    lineHeight: {
      body: Math.round(16 * 1.2),
      title: Math.round(24 * 1.25),
    },
  },
  shadow: {
    soft: {
      shadowColor: '#000000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  },
};

const lightColors: ColorTokens = {
  primary: {
    purple: '#5631E8',
    midnight: '#0E0940',
  },
  surface: {
    background: '#EDF6FF',
    card: '#FFFFFF',
    imageWell: '#F6F6FF',
  },
  text: {
    primary: '#0E0940',
    muted: '#6B7280',
    placeholder: '#9CA3AF',
    onPrimary: '#FFFFFF',
  },
  icon: {
    muted: '#6B7280',
  },
  tabbar: {
    background: 'rgba(237, 246, 255, 0.50)',
    border: 'rgba(14, 9, 64, 0.08)',
  },
  status: {
    error: '#DC2626',
  },
};

const darkColors: ColorTokens = {
  primary: {
    purple: '#7C5CFF',
    midnight: '#E9E6FF',
  },
  surface: {
    background: '#0B1020',
    card: '#121A2E',
    imageWell: '#0F1730',
  },
  text: {
    primary: '#E9E6FF',
    muted: 'rgba(233, 230, 255, 0.65)',
    placeholder: 'rgba(233, 230, 255, 0.45)',
    onPrimary: '#FFFFFF',
  },
  icon: {
    muted: 'rgba(233, 230, 255, 0.75)',
  },
  tabbar: {
    background: 'rgba(18, 26, 46, 0.75)',
    border: 'rgba(233, 230, 255, 0.10)',
  },
  status: {
    error: '#F87171',
  },
};

// jouw detail tokens (ik behoud je structuur; kleuren lezen we straks uit tokens.color)
const detail = {
  background: '#EDF6FF',
  sheet: '#FFFFFF',
  header: { height: 72, paddingX: 24 },
  hero: { height: 310, paddingX: 24, paddingTop: 24, imageOverlap: 24 },
  artwork: { size: 200 },
  title: {
    fontFamily: 'CabinetGrotesk-Extrabold',
    fontSize: 32,
    lineHeight: 34,
    color: '#0E0940',
    maxWidthPct: 0.75,
  },
  idBadge: {
    fontFamily: 'CabinetGrotesk-Extrabold',
    fontSize: 14,
    color: '#0E0940',
    opacity: 0.3,
  },
  types: { marginTop: 12, gap: 8 },
  chip: {
    height: 32,
    paddingX: 12,
    gap: 8,
    radius: 999,
    background: '#E8EEFA',
    dotSize: 12,
    dotColor: '#22C55E',
    fontSize: 16,
    textColor: '#0E0940',
  },
  tabs: {
    height: 56,
    fontSize: 14,
    lineHeight: 18,
    activeColor: '#5631E8',
    inactiveColor: '#9CA3AF',
    dividerColor: 'rgba(14, 9, 64, 0.12)',
    indicatorHeight: 2,
  },
  content: {
    label: { size: 14, color: '#0E0940', width: 100 },
    value: { size: 14, color: '#6B7280' },
    rowGap: 16,
    columnGap: 16,
  },
  stats: {
    paddingX: 24,
    rowGap: 24,
    labelSize: 14,
    valueSize: 14,
    valueOpacity: 0.65,
    lineGap: 8,
    barHeight: 4,
    barRadius: 99,
    trackColor: 'rgba(14, 9, 64, 0.10)',
    fillColor: '#5631E8',
    labelColor: '#0E0940',
    valueColor: '#0E0940',
  },
};

export function getTokens(scheme: 'light' | 'dark' = 'light'): Tokens {
  const color = scheme === 'dark' ? darkColors : lightColors;

  const themedDetail = {
    ...detail,
    background: color.surface.background,
    sheet: color.surface.card,
    title: { ...detail.title, color: color.text.primary },
    idBadge: { ...detail.idBadge, color: color.text.primary },
    chip: {
      ...detail.chip,
      background: scheme === 'dark' ? 'rgba(233,230,255,0.10)' : '#E8EEFA',
      textColor: color.text.primary,
    },
    tabs: {
      ...detail.tabs,
      activeColor: color.primary.purple,
      inactiveColor: color.text.placeholder,
      dividerColor:
        scheme === 'dark' ? 'rgba(233,230,255,0.12)' : 'rgba(14, 9, 64, 0.12)',
    },
    content: {
      ...detail.content,
      label: { ...detail.content.label, color: color.text.primary },
      value: { ...detail.content.value, color: color.text.muted },
    },
    stats: {
      ...detail.stats,
      trackColor: scheme === 'dark' ? 'rgba(233,230,255,0.12)' : detail.stats.trackColor,
      fillColor: color.primary.purple,
      labelColor: color.text.primary,
      valueColor: color.text.primary,
    },
  };

  return {
    color,
    spacing: base.spacing,
    radius: base.radius,
    typography: base.typography,
    shadow: base.shadow,
    detail: themedDetail,
  };
}

// ✅ THIS FIXES YOUR IMPORTS EVERYWHERE:
export const tokens = getTokens('light');
export const tokensDark = getTokens('dark');

