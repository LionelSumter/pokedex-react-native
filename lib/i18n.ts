import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

export const i18n = new I18n({
  en: {
    // Tabs screens
    common: { back: 'Back' },

    allPokemon: 'All Pokémon',
    favorites: 'Favorites',

    // Common
    loading: 'Loading…',
    error: 'Error',
    failedToLoad: 'Failed to load',
    back: 'Back',

    // Home
    searchPlaceholder: 'Search for Pokémon...',

    // Favorites
    noFavorites: 'No favorites yet…',

    // Detail tabs
    tabs: {
      about: 'About',
      stats: 'Stats',
      evolution: 'Evolution',
    },

    stats: {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
},


    // Detail labels/messages
    details: {
      name: 'Name',
      id: 'ID',
      base: 'Base',
      weight: 'Weight',
      height: 'Height',
      types: 'Types',
      abilities: 'Abilities',

      loadingEvolution: 'Loading evolution…',
      failedToLoadEvolution: 'Failed to load evolution',
    },
  },

  nl: {
    // Tabs screens
    common: { back: 'Vorige' },

    allPokemon: 'Alle Pokémon',
    favorites: 'Favorieten',

    // Common
    loading: 'Laden…',
    error: 'Fout',
    failedToLoad: 'Kon niet laden',
    back: 'Vorige',

    // Home
    searchPlaceholder: 'Zoek naar Pokémon...',

    // Favorites
    noFavorites: 'Nog geen favorieten…',

    // Detail tabs
    tabs: {
      about: 'Info',
      stats: 'Stats',
      evolution: 'Evolutie',
    },

    //stats

    stats: {
  hp: 'HP',
  attack: 'Aanval',
  defense: 'Verdediging',
  'special-attack': 'Sp. Aanval',
  'special-defense': 'Sp. Verdediging',
  speed: 'Snelheid',
},



    // Detail labels/messages
    details: {
      name: 'Naam',
      id: 'ID',
      base: 'Base',
      weight: 'Gewicht',
      height: 'Lengte',
      types: 'Types',
      abilities: 'Vaardigheden',

      loadingEvolution: 'Evolutie laden…',
      failedToLoadEvolution: 'Kon evolutie niet laden',
    },
  },
});

i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';
i18n.enableFallback = true;
