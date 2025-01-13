async function getServiceGithubAuth(backendAddress: string, token: string)
{
  const response = await fetch(`${backendAddress}/api/github/authorize`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

async function sendServiceGithubAuth(backendAddress: string, token: string, code: string)
{
  const response = await fetch(`${backendAddress}/api/github/authorize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  return data;
}

export default {
  getServiceGithubAuth,
  sendServiceGithubAuth
};
