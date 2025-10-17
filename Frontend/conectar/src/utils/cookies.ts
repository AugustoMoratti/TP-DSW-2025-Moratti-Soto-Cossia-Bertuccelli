
export const setCookie = (
  name: string,
  value: string,
  days = 30, // Tiempo por defecto
  options: { path?: string; sameSite?: "Lax" | "Strict" | "None"; secure?: boolean } = {}
) => {
  const { path = "/", sameSite = "Lax", secure = false } = options;
  const maxAge = days * 24 * 60 * 60; // Lo paso a segundos
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAge}`,
    `Path=${path}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) parts.push("Secure");
  document.cookie = parts.join("; ");
};

export const getCookie = (name: string): string | null => {
  const row = document.cookie
    .split("; ")
    .find((x) => x.startsWith(`${name}=`));
  return row ? decodeURIComponent(row.split("=")[1]) : null;
};

export const deleteCookie = (name: string, path = "/") => {
  document.cookie = `${name}=; Max-Age=0; Path=${path}; SameSite=Lax`;
};
