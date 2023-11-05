export const registerMembershipRequest = async (membership) => {
  return fetch(`http://localhost:8080/api/membership/add-membership`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(membership),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
