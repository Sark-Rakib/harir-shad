const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
  }

  return parseResponse<T>(res);
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getAuth: <T>(path: string, token: string) =>
    request<T>(path, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  postAuth: <T>(path: string, body: unknown, token: string) =>
    request<T>(path, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  putAuth: <T>(path: string, body: unknown, token: string) =>
    request<T>(path, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  patchAuth: <T>(path: string, body: unknown, token: string) =>
    request<T>(path, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    }),
  deleteAuth: <T>(path: string, token: string) =>
    request<T>(path, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
  postFormAuth: <T>(path: string, formData: FormData, token: string) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: "no-store",
    })
      .then((res) => parseResponse<T>(res))
      .catch((err) => {
        if (err instanceof ApiError) throw err;
        throw new ApiError(0, "সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
      }),
};
