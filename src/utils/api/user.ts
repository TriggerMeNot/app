async function changeUserName(backendAddress: string, token: string, newName: string, userId: string) {
  const response = await fetch(`${backendAddress}/api/user/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username: newName }),
  });

  if (!response.ok) {
    throw new Error("Failed to change user name");
  }

  const data = await response.json();
  return data;
}

export default {
  changeUserName,
};
