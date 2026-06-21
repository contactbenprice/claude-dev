/**
 * Caddy Daddy — app-wide config constants
 *
 * To enable server-side email capture, set EMAIL_WEBHOOK_URL to your
 * Formspree endpoint (https://formspree.io/f/YOUR_FORM_ID) or any
 * webhook that accepts a JSON POST body: { email, timestamp }.
 * Leave blank to skip the POST (emails are still saved to localStorage).
 */
export const EMAIL_WEBHOOK_URL = ''

export const STORAGE_KEY_EMAILS = 'caddy_daddy_emails'
