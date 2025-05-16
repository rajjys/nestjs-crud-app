const API_URL = "";
export async function api(path, method = "GET", body, token) {
   
  const res = await fetch(API_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  // If response is 204 No Content or has no body, return null
  if (res.status === 204) return null;

  const text = await res.text();
  if (!res.ok) throw (text ? JSON.parse(text) : { message: res.statusText });
  return text ? JSON.parse(text) : null;
}