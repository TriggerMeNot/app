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

async function getServiceGoogleAuth(backendAddress: string, token: string)
{
  const response = await fetch(`${backendAddress}/api/google/authorize`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

async function sendServiceGoogleAuth(backendAddress: string, token: string, code: string)
{
  const response = await fetch(`${backendAddress}/api/google/authorize`, {
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

async function getServiceDiscordAuth(backendAddress: string, token: string)
{
  const response = await fetch(`${backendAddress}/api/discord/authorize`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

async function sendServiceDiscordAuth(backendAddress: string, token: string, code: string)
{
  const response = await fetch(`${backendAddress}/api/discord/authorize`, {
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

async function getServiceMicrosoftAuth(backendAddress: string, token: string)
{
  const response = await fetch(`${backendAddress}/api/microsoft/authorize`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data;
}

async function sendServiceMicrosoftAuth(backendAddress: string, token: string, code: string)
{
  const response = await fetch(`${backendAddress}/api/microsoft/authorize`, {
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
  sendServiceGithubAuth,
  getServiceGoogleAuth,
  sendServiceGoogleAuth,
  getServiceDiscordAuth,
  sendServiceDiscordAuth,
  getServiceMicrosoftAuth,
  sendServiceMicrosoftAuth,
};
