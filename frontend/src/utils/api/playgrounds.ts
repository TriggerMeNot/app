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

async function getPlaygroundById(apiUrl: string, token: string, id: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

async function addActionToPlayground(apiUrl: string, token: string, playgroundId: number, actionId: number, settings: any, x: number, y: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${playgroundId}/action/${actionId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      settings,
      x,
      y
    }),
  });
  const data = await response.json();
  return data;
}

async function addReactionToPlayground(apiUrl: string, token: string, playgroundId: number, reactionId: number, settings: any, x: number, y: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${playgroundId}/reaction/${reactionId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      settings,
      x,
      y
    }),
  });
  const data = await response.json();
  return data;
}

async function deleteActionFromPlayground(apiUrl: string, token: string, playgroundId: number, id: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${playgroundId}/action/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

async function deleteReactionFromPlayground(apiUrl: string, token: string, playgroundId: number, id: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${playgroundId}/reaction/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

async function deletePlayground(apiUrl: string, token: string, id: number)
{
  const response = await fetch(`${apiUrl}/api/playground/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
}

const addActionToReactionLink = async (backendAddress: string, token: string, triggerId: string, reactionPlaygroundId: string) => {
  const response = await fetch(`${backendAddress}/api/playground/link/action/${triggerId}/reaction/${reactionPlaygroundId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create link.");
  }
};

const addReactionToReactionLink = async (backendAddress: string, token: string, triggerId: string, actionPlaygroundId: string) => {
  const response = await fetch(`${backendAddress}/api/playground/link/reaction/${triggerId}/reaction/${actionPlaygroundId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create link.");
  }
};

const deleteLink = async (backendAddress: string, token: string, linkId: string) => {
  const response = await fetch(`${backendAddress}/api/playground/link/${linkId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete link.");
  }
};

const editReaction = async (backendAddress: string, token: string, playgroundId: string, reactionId: string, settings: any, x: number, y: number) => {
  const response = await fetch(`${backendAddress}/api/playground/${playgroundId}/reaction/${reactionId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      settings,
      x,
      y
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to edit reaction settings.");
  }

  const data = await response.json();
  return data;
}

export default {
  getAllPlaygrounds,
  createPlayground,
  getPlaygroundById,
  addActionToPlayground,
  addReactionToPlayground,
  deleteActionFromPlayground,
  deleteReactionFromPlayground,
  deletePlayground,
  addActionToReactionLink,
  addReactionToReactionLink,
  deleteLink,
  editReaction,
};
