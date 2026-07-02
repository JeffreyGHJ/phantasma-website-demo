export const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '';
export const RECAPTCHA_INVISIBLE_SITE_KEY = process.env.REACT_APP_RECAPTCHA_INVISIBLE_SITE_KEY || '';
export const RECAPTCHA_SITE_KEY_ALT = process.env.REACT_APP_RECAPTCHA_SITE_KEY_ALT || '';

// When keys are not configured (e.g. demo mode), reCAPTCHA is disabled entirely.
export const RECAPTCHA_ENABLED = !!RECAPTCHA_SITE_KEY;
