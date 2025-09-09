export const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
};
export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

// Signin API
export const createUser = async (newUser: NewUser) => {
  const res = await fetch("http://localhost:8000/api/v1/signup", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(newUser),
  });

  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};

// Login API
export const loginUser = async (loginUser: LoginUser) => {
  const res = await fetch("http://localhost:8000/api/v1/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(loginUser),
  });
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};
