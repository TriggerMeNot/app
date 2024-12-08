async function getAllPlaygrounds(apiUrl: string, token: string)
{
  const response = await fetch(`${apiUrl}/api/playground`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

async function createPlayground(apiUrl: string, token: string)
{
  const response = await fetch(`${apiUrl}/api/playground`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });
  const data = await response.json();
  return data;
}

export default { getAllPlaygrounds, createPlayground };
