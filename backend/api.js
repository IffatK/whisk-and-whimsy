const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handle = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  if (!res.ok)
    throw new Error(
      data.error || data.errors?.[0]?.msg || "Something went wrong"
    );

  return data;
};

export const api = {
  getMe: () =>
    fetch(`${BASE_URL}/user/me`, { headers: headers() }).then(handle),

  updateMe: (body) =>
    fetch(`${BASE_URL}/user/update`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handle),

  getAddresses: () =>
    fetch(`${BASE_URL}/address`, { headers: headers() }).then(handle),

  addAddress: (body) =>
    fetch(`${BASE_URL}/address`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handle),

  updateAddress: (id, body) =>
    fetch(`${BASE_URL}/address/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(body),
    }).then(handle),

  deleteAddress: (id) =>
    fetch(`${BASE_URL}/address/${id}`, {
      method: "DELETE",
      headers: headers(),
    }).then(handle),
};