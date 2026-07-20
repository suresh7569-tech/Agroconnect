const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

exports.generateOtp = async (phone) => {
  if (!phone.startsWith("+")) {
    phone = "+91" + phone;
  }

  await client.verify.v2
    .services(verifyServiceSid)
    .verifications.create({
      to: phone,
      channel: "sms",
    });

  return true;
};

exports.verifyOtp = async (phone, code) => {
  if (!phone.startsWith("+")) {
    phone = "+91" + phone;
  }

  const result = await client.verify.v2
    .services(verifyServiceSid)
    .verificationChecks.create({
      to: phone,
      code: code,
    });

  if (result.status === "approved") {
    return { ok: true };
  }

  return {
    ok: false,
    reason: result.status,
  };
}; 
