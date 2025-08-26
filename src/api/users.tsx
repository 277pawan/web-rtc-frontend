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
    throw new Error(data.message || "Failed to create user");
  }
  return data;
};
