const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');
const { generateOtp, verifyOtp } = require('../utils/otp');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PIN_RE = /^\d{6}$/;

function publicUser(u) {
  return {
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    isVerified: u.isVerified,
    address: u.address,
    profilePhoto: u.profilePhoto,
    preferredLanguage: u.preferredLanguage,
  };
}

exports.registerConsumer = async (req, res) => {
  const { name, email, phone, password, address, preferredLanguage } = req.body || {};

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'name, email, phone and password are required' });
  }
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Phone must be a 10-digit Indian mobile number' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  if (address?.pincode && !PIN_RE.test(address.pincode)) {
    return res.status(400).json({ error: 'Pincode must be 6 digits' });
  }

  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
  if (existing) return res.status(409).json({ error: 'A user with this email or phone already exists' });

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name, email, phone, passwordHash,
    role: 'consumer',
    address,
    preferredLanguage: preferredLanguage || 'en',
  });

  generateOtp(phone);
  res.status(201).json({
    message: 'Consumer registered. OTP sent to phone.',
    user: publicUser(user),
    nextStep: 'verify_otp',
  });
};

exports.registerFarmer = async (req, res) => {
  const { name, email, phone, password, address, govtIdUrl, landDocUrl, profilePhoto, preferredLanguage } = req.body || {};

  if (!name || !email || !phone || !password || !address?.village || !address?.district || !address?.state || !address?.pincode) {
    return res.status(400).json({ error: 'Farmer registration requires name, email, phone, password, and full village address' });
  }
  if (!govtIdUrl || !landDocUrl) {
    return res.status(400).json({ error: 'Government ID and land document URLs are required' });
  }
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email' });
  if (!PHONE_RE.test(phone)) return res.status(400).json({ error: 'Phone must be a 10-digit Indian mobile number' });
  if (!PIN_RE.test(address.pincode)) return res.status(400).json({ error: 'Pincode must be 6 digits' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
  if (existing) return res.status(409).json({ error: 'A user with this email or phone already exists' });

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name, email, phone, passwordHash,
    role: 'farmer',
    address,
    govtIdUrl,
    landDocUrl,
    profilePhoto,
    preferredLanguage: preferredLanguage || 'en',
  });

  generateOtp(phone);
  res.status(201).json({
    message: 'Farmer registered. OTP sent. Account will remain pending admin approval after OTP verification.',
    user: publicUser(user),
    nextStep: 'verify_otp_then_await_admin_approval',
  });
};

exports.sendOtp = async (req, res) => {
  const { phone } = req.body || {};
  if (!PHONE_RE.test(phone || '')) return res.status(400).json({ error: 'Valid 10-digit phone is required' });
  generateOtp(phone);
  res.json({ message: 'OTP sent', phone });
};

exports.verifyOtpAndLogin = async (req, res) => {
  const { phone, code } = req.body || {};
  if (!phone || !code) return res.status(400).json({ error: 'phone and code are required' });

  const result = verifyOtp(phone, code);
  if (!result.ok) {
    const reason = { no_otp: 'No OTP requested', expired: 'OTP expired', mismatch: 'Invalid OTP' }[result.reason];
    return res.status(400).json({ error: reason });
  }

  const user = await User.findOne({ phone });
  if (!user) return res.status(404).json({ error: 'No user with this phone' });

  const wasFirstVerify = !user.isVerified;
  if (user.role === 'consumer') user.isVerified = true;
  await user.save();

  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.json({
    message: wasFirstVerify ? 'Phone verified' : 'OTP verified',
    token,
    user: publicUser(user),
    pendingAdminApproval: user.role === 'farmer' && !user.isVerified,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  if (user.role === 'farmer' && !user.isVerified) {
    return res.status(403).json({ error: 'Farmer account is pending admin approval' });
  }

  const token = signToken({ sub: user._id.toString(), role: user.role });
  res.json({ token, user: publicUser(user) });
};

exports.me = async (req, res) => {
  res.json({ user: publicUser(req.user) });
};
