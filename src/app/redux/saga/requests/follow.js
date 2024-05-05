import * as type from "../../types";

export const followUserRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/follow/follow-user`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const unfollowUserRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/follow/unfollow-user`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const getAllFollowers = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/follow/follower/${userId}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const getAllFollowings = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/follow/following/${userId}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};

export const isFollowingRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/follow/is-following`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      console.log("error:", error);
    });
};
