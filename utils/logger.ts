// utils/logger.ts
const isProd = process.env.NODE_ENV === 'production';

type LogFn = (...args: unknown[]) => void;

const noop: LogFn = () => {};

export const logger = {
  // In prod: geen logs; in dev mag je nog debuggen met logger.debug i.p.v. console.log
  debug: isProd ? noop : (...args: unknown[]) => {
    // voel je vrij: eventueel formatten of naar devtools sturen
    // console.debug(...args);  // wil je écht niets naar console? laat uit.
  },
  info: isProd ? noop : (...args: unknown[]) => {
    // console.info(...args);
  },
  warn: (...args: unknown[]) => {
    // waarschuwingen mogen (helpt je bij fouten), maar wil je absolute stilte → zet ook deze op noop
    // console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // errors mag je altijd loggen
    // console.error(...args);
  },
};
