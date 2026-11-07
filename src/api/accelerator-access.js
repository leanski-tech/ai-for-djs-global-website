// Accelerator instant-access gate.
// PayPal returns the buyer here after checkout with a transaction id (tx).
// If Payment Data Transfer (PDT) is enabled on the PayPal account and the
// PAYPAL_PDT_TOKEN env var is set in Vercel, this verifies the payment with
// PayPal and sends a confirmed $150 buyer straight into the program.
// In every other case it falls back to the thank-you page (check your email),
// so a buyer is never stranded and the program link is never printed here.

const WELCOME_URL =
  process.env.ACCELERATOR_WELCOME_URL ||
  "https://aifordjsglobal.com/accelerator/welcome-6ae36dd7";
const FALLBACK_URL = "https://aifordjsglobal.com/thank-you-accelerator";
const RECEIVER_EMAIL = "leanski@gmail.com";
const EXPECTED_AMOUNT = "150.00";
const EXPECTED_CURRENCY = "USD";

function parsePdtBody(text) {
  const lines = String(text || "").trim().split(/\r?\n/);
  const status = (lines.shift() || "").trim();
  const fields = {};
  for (const line of lines) {
    const i = line.indexOf("=");
    if (i > 0) {
      const key = line.slice(0, i).trim();
      let value = line.slice(i + 1).trim();
      try { value = decodeURIComponent(value.replace(/\+/g, " ")); } catch (_) {}
      fields[key] = value;
    }
  }
  return { status, fields };
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const goFallback = () => res.redirect(302, FALLBACK_URL);

  try {
    const tx = String(req.query?.tx || req.body?.tx || "").trim();
    const token = process.env.PAYPAL_PDT_TOKEN;
    if (!tx || !token) return goFallback();

    const body = new URLSearchParams({
      cmd: "_notify-synch",
      tx,
      at: token,
    }).toString();

    const paypalResponse = await fetch("https://www.paypal.com/cgi-bin/webscr", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const { status, fields } = parsePdtBody(await paypalResponse.text());
    if (status !== "SUCCESS") return goFallback();

    const paid = String(fields.payment_status || "").trim() === "Completed";
    const amountOk = String(fields.mc_gross || "").trim() === EXPECTED_AMOUNT;
    const currencyOk = String(fields.mc_currency || "").trim() === EXPECTED_CURRENCY;
    const receiverOk =
      String(fields.receiver_email || "").trim().toLowerCase() === RECEIVER_EMAIL;
    const itemOk = String(fields.item_name || "").includes("Accelerator");

    if (paid && amountOk && currencyOk && receiverOk && itemOk) {
      return res.redirect(302, WELCOME_URL);
    }
    return goFallback();
  } catch (error) {
    console.error("Accelerator access gate failed", error);
    return goFallback();
  }
};
