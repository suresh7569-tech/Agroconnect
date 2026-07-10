const crypto = require('crypto');

const store = new Map();
const TTL_MS = 5 * 60 * 1000;

function keyFor(phone) {
  return `otp:${phone}`;
}

exports.generateOtp = (phone) => {
  const code = String(crypto.randomInt(100000, 1000000));
  store.set(keyFor(phone), { code, expiresAt: Date.now() + TTL_MS });
  console.log(`[otp] ${phone} → ${code} (dev-only console log)`);
  return code;
};

exports.verifyOtp = (phone, code) => {
  const entry = store.get(keyFor(phone));
  if (!entry) return { ok: false, reason: 'no_otp' };
  if (Date.now() > entry.expiresAt) {
    store.delete(keyFor(phone));
    return { ok: false, reason: 'expired' };
  }
  if (entry.code !== code) return { ok: false, reason: 'mismatch' };
  store.delete(keyFor(phone));
  return { ok: true };
};
