// constants/tokens.ts
export const tokens = {
  color: {
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
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,

    // app-level spacing tokens (worden al gebruikt in je code)
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
      bold: 'Rubik_700Bold',
      black: 'Rubik_900Black',
      semibold: 'Rubik_600SemiBold',
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

  /* -------------------------------------------------- */
  /* Detail page tokens (voor app/pokemon/[name].tsx)     */
  /* -------------------------------------------------- */
  detail: {
    background: '#EDF6FF',
    sheet: '#FFFFFF',

    header: {
      height: 72,
      paddingX: 24,
    },

    hero: {
      height: 310,
      paddingX: 24,

      // ✅ Figma 1-op-1 spacing
      paddingTop: 24, // chip → image
      imageOverlap: 24, // image → tabs
    },

    artwork: {
      size: 200,
    },

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

    types: {
      marginTop: 12,
      gap: 8,
    },

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
      label: {
        size: 14,
        color: '#0E0940',
        width: 100,
      },
      value: {
        size: 14,
        color: '#6B7280',
      },
      rowGap: 16,
      columnGap: 16,
    },

    stats: {
    paddingX: 24,         // links/rechts
    rowGap: 24,           // tussen stat blokken
    labelSize: 14,        // Rubik SemiBold 14
    valueSize: 14,        // Rubik Regular 14
    valueOpacity: 0.65,   // zoals in Figma
    lineGap: 8,           // tekst -> balk
    barHeight: 4,         // Figma: 4px
    barRadius: 99,        // pill
    trackColor: 'rgba(14, 9, 64, 0.10)', // zachte grijs/paars lijn
    fillColor: '#5631E8', // primary purple
    labelColor: '#0E0940',
    valueColor: '#0E0940',
  },

  },
} as const;
