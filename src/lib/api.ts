import { getServerBaseUrl } from "./utils";

// All callers pass absolute paths like "/api/products". On the server, relative
// URLs don't resolve, so we construct an absolute base URL.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।";
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${getServerBaseUrl() || API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
  }

  return parseResponse<T>(res);
}

function authHeaders(token?: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAuth: <T>(path: string, token?: string | null) =>
    request<T>(path, {
      headers: authHeaders(token),
    }),
  postAuth: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),
  putAuth: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),
  patchAuth: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }),
  deleteAuth: <T>(path: string, token?: string | null) =>
    request<T>(path, {
      method: "DELETE",
      headers: authHeaders(token),
    }),
  postFormAuth: <T>(path: string, formData: FormData, token?: string | null) =>
    fetch(`${getServerBaseUrl() || API_URL}${path}`, {
      method: "POST",
      headers: authHeaders(token),
      body: formData,
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => parseResponse<T>(res))
      .catch((err) => {
        if (err instanceof ApiError) throw err;
        throw new ApiError(0, "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
      }),
};
