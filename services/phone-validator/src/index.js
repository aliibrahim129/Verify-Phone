const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const VERIPHONE_API_KEY = process.env.VERIPHONE_API_KEY;
const VERIPHONE_BASE_URL = process.env.VERIPHONE_BASE_URL || "https://api.veriphone.io/v2";

if (!VERIPHONE_API_KEY) {
  console.warn("[phone-validator] VERIPHONE_API_KEY is missing. Set it in .env");
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function badRequest(res, msg = "Invalid number") {
  return res.status(400).json({ error: msg });
}

app.post("/validate", async (req, res) => {
  try {
    const { mobile, defaultCountry } = req.body || {};
    if (typeof mobile !== "string" || !mobile.trim()) {
      return badRequest(res, "Body must include a non-empty 'mobile' string");
    }

    // 1) Parse & basic validity (format) using libphonenumber
    const phone = parsePhoneNumberFromString(mobile.trim(), defaultCountry);
    if (!phone || !phone.isValid()) {
      return badRequest(res, "Invalid number");
    }

    const e164 = phone.number; // "+14155552671"
    const iso2 = (phone.country || defaultCountry || "").toUpperCase() || null;
    const countryName = iso2 ? regionNames.of(iso2) : null;

    // 2) lookup via Veriphone
    try {
      const url = `${VERIPHONE_BASE_URL}/verify`;
      const { data } = await axios.get(url, {
        params: { phone: e164, key: VERIPHONE_API_KEY },
        timeout: 7000,
      });

      if (data && data.phone_valid === false) {
        return badRequest(res, "Invalid number");
      }

      const operatorName =
        data && typeof data.carrier === "string" && data.carrier.trim()
          ? data.carrier.trim()
          : "Unknown";

      return res.json({
        countryCode: iso2,
        countryName,
        operatorName,
      });
    } catch (e) {
      return res
        .status(502)
        .json({ error: "Carrier lookup failed", detail: String(e.message || e) });
    }
  } catch (err) {
    console.error("[/validate] error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

app.listen(PORT, () => {
  console.log(`[phone-validator] listening on http://localhost:${PORT} (provider=veriphone)`);
});
