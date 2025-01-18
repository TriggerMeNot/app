async function forgotPassword(apiUrl: string, email: string)
{
  const response = await fetch(`${apiUrl}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}

async function resetPassword(apiUrl: string, token: string, newPassword: string)
{
  const response = await fetch(`${apiUrl}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      password: newPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  return data;
}

export default {
  forgotPassword,
  resetPassword,
}
