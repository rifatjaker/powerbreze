const API_URL = import.meta.env.VITE_API_URL ?? "/api/index.php";
const TOKEN_KEY = "pb-admin-token";
const PASSWORD_CHANGE_KEY = "pb-admin-password-change";

type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const authToken = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  requiresPasswordChange: () => sessionStorage.getItem(PASSWORD_CHANGE_KEY) === "true",
  set: (token: string, requiresPasswordChange = false) => {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(PASSWORD_CHANGE_KEY, String(requiresPasswordChange));
  },
  clear: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(PASSWORD_CHANGE_KEY);
  },
};

export async function apiRequest<T>(
  resource: string,
  options: RequestInit & { action?: string } = {},
): Promise<T> {
  const { action, headers, ...requestOptions } = options;
  const token = authToken.get();
  const isFormData = typeof FormData !== "undefined" && requestOptions.body instanceof FormData;
  const response = await fetch(
    `${API_URL}?resource=${encodeURIComponent(resource)}${action ? `&action=${encodeURIComponent(action)}` : ""}`,
    {
      ...requestOptions,
      headers: {
        Accept: "application/json",
        ...(requestOptions.body && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    },
  );

  let payload: ApiEnvelope<T> | { error?: string; message?: string };
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok) {
    const message = "error" in payload ? payload.error : payload.message;
    throw new ApiError(message || "The request could not be completed.", response.status);
  }

  return (payload as ApiEnvelope<T>).data;
}
