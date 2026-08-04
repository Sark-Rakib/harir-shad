import { env, isSslcommerzConfigured } from "../config/env";
import { HttpError } from "../utils/HttpError";

interface InitPaymentParams {
  tranId: string;
  total: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  customerId: string;
  itemName: string;
}

export function getGatewayBaseUrl(): string {
  return env.IS_LIVE
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";
}

export async function initPayment(params: InitPaymentParams) {
  if (!isSslcommerzConfigured()) {
    throw new HttpError(
      500,
      "SSLCommerz কনফিগার করা হয়নি। বর্তমানে শুধুমাত্র ক্যাশ অন ডেলিভারি সমর্থিত।",
    );
  }

  const payload = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: String(params.total),
    currency: "BDT",
    tran_id: params.tranId,
    success_url: `${env.SERVER_URL}/api/payments/success`,
    fail_url: `${env.SERVER_URL}/api/payments/fail`,
    cancel_url: `${env.SERVER_URL}/api/payments/cancel`,
    ipn_url: `${env.SERVER_URL}/api/payments/ipn`,
    cus_name: params.name,
    cus_email: params.email ?? "customer@example.com",
    cus_add1: params.address,
    cus_city: params.city,
    cus_country: "Bangladesh",
    cus_phone: params.phone,
    ship_name: params.name,
    ship_add1: params.address,
    ship_city: params.city,
    ship_country: "Bangladesh",
    product_name: params.itemName,
    product_category: "Food",
    product_profile: "general",
    multi_card_name: "bkash,nagad,visa,mastercard,am_ex",
  });

  const res = await fetch(`${getGatewayBaseUrl()}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  const json = (await res.json().catch(() => null)) as {
    status?: string;
    status_code?: number;
    GatewayPageURL?: string;
    failedreason?: string;
  } | null;

  if (!res.ok || json?.status !== "SUCCESS" || !json.GatewayPageURL) {
    throw new HttpError(
      502,
      json?.failedreason ?? "পেমেন্ট গেটওয়ে শুরু করা যায়নি।",
    );
  }

  return json;
}

export async function validatePayment(tranId: string, amount: string) {
  if (!isSslcommerzConfigured()) {
    throw new HttpError(500, "SSLCommerz কনফিগার করা হয়নি।");
  }

  const payload = new URLSearchParams({
    store_id: env.SSLCOMMERZ_STORE_ID,
    store_passwd: env.SSLCOMMERZ_STORE_PASSWORD,
    tran_id: tranId,
    amount,
  });

  const res = await fetch(
    `${getGatewayBaseUrl()}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(tranId)}&store_id=${encodeURIComponent(env.SSLCOMMERZ_STORE_ID)}&store_passwd=${encodeURIComponent(env.SSLCOMMERZ_STORE_PASSWORD)}&format=json`,
  );

  const json = (await res.json().catch(() => null)) as {
    status?: string;
    val_id?: string;
  } | null;

  void payload;

  return json?.status === "VALID" || json?.status === "VALIDATED";
}
