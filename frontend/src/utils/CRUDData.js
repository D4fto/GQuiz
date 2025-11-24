export async function deleteData(route, id) {
  try {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + route + id, {
        method: "DELETE",
        credentials: "include",
      })
    ).json();
    if (response.error) {
      console.error(response.error);
      throw new Error(response.error);
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

export async function createData(route, body) {
  try {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + route, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
    ).json();
    if (response.error) {
      console.error(response.error);
      throw new Error(response.error);
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

export async function editData(route, id, body) {
  if (!id) {
    return;
  }
  try {
    const response = await (
      await fetch(import.meta.env.VITE_API_URL + route + id, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
    ).json();
    if (response.error) {
      console.error(response.error);
      throw new Error(response.error);
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}