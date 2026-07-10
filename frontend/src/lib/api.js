const BASE = '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  // Auth
  registerConsumer: (body) => request('/auth/register/consumer', { method: 'POST', body }),
  registerFarmer: (body) => request('/auth/register/farmer', { method: 'POST', body }),
  sendOtp: (phone) => request('/auth/otp/send', { method: 'POST', body: { phone } }),
  verifyOtp: (phone, code) => request('/auth/otp/verify', { method: 'POST', body: { phone, code } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/auth/me', { token }),

  // Farms
  listFarms: (params) => request('/farms' + qs(params)),
  getFarm: (id) => request(`/farms/${id}`),
  getMyFarm: (token) => request('/farms/mine', { token }),
  saveMyFarm: (body, token) => request('/farms/mine', { method: 'POST', body, token }),

  // Crops
  listCrops: (params) => request('/crops' + qs(params)),
  getCrop: (id) => request(`/crops/${id}`),
  myCrops: (token) => request('/crops/mine', { token }),
  createCrop: (body, token) => request('/crops', { method: 'POST', body, token }),
  updateCrop: (id, body, token) => request(`/crops/${id}`, { method: 'PATCH', body, token }),
  deleteCrop: (id, token) => request(`/crops/${id}`, { method: 'DELETE', token }),

  // Orders
  createOrder: (body, token) => request('/orders', { method: 'POST', body, token }),
  myOrders: (token) => request('/orders/mine', { token }),
  getOrder: (id, token) => request(`/orders/${id}`, { token }),
  farmerOrders: (token) => request('/orders/farmer', { token }),
  updateOrderStatus: (id, status, token) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status }, token }),

  // Visits
  bookVisit: (body, token) => request('/visits', { method: 'POST', body, token }),
  myVisits: (token) => request('/visits/mine', { token }),
  farmerVisits: (token) => request('/visits/farmer', { token }),
  cancelVisit: (id, token) => request(`/visits/${id}/cancel`, { method: 'PATCH', token }),

  // Reviews
  reviewsByFarm: (farmId) => request(`/reviews/farm/${farmId}`),
  createReview: (body, token) => request('/reviews', { method: 'POST', body, token }),

  // Admin
  adminStats: (token) => request('/admin/stats', { token }),
  pendingFarmers: (token) => request('/admin/farmers/pending', { token }),
  approveFarmer: (id, token) => request(`/admin/farmers/${id}/approve`, { method: 'POST', token }),
  rejectFarmer: (id, token) => request(`/admin/farmers/${id}/reject`, { method: 'POST', token }),
  pendingCrops: (token) => request('/admin/crops/pending', { token }),
  approveCrop: (id, token) => request(`/admin/crops/${id}/approve`, { method: 'POST', token }),
  rejectCrop: (id, token) => request(`/admin/crops/${id}/reject`, { method: 'POST', token }),
  adminCreateCrop: (body, token) => request('/admin/crops', { method: 'POST', body, token }),
  adminUsers: (role, token) => request(`/admin/users${role ? `?role=${role}` : ''}`, { token }),
  setUserActive: (id, isActive, token) => request(`/admin/users/${id}/active`, { method: 'PATCH', body: { isActive }, token }),

  // Payments (mock in dev)
  createRazorpayOrder: (amount, receipt, token) =>
    request('/payments/razorpay/order', { method: 'POST', body: { amount, receipt }, token }),
  verifyPayment: (body, token) => request('/payments/razorpay/verify', { method: 'POST', body, token }),

  // Uploads
  uploadInfo: (token) => request('/uploads/info', { token }),

  // Seed (dev)
  seedDemo: () => request('/seed/demo', { method: 'POST' }),

  // Stores (city stores + procurement centers)
  listStores: (params) => request('/stores' + qs(params)),
  getStore: (id) => request(`/stores/${id}`),

  // Farm videos
  listVideos: (params) => request('/videos' + qs(params)),

  // Smart mobile vans
  listVans: (params) => request('/vans' + qs(params)),
  getVan: (id) => request(`/vans/${id}`),
  reserveVan: (id, body) => request(`/vans/${id}/reserve`, { method: 'POST', body }),
};

function qs(params) {
  if (!params) return '';
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '' && v !== null) s.append(k, v); });
  const str = s.toString();
  return str ? `?${str}` : '';
}