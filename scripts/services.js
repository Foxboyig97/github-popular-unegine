import request from "./request.js";
import queryString from "./queryString.js";

export default function queryRepositoty(queryObject = {}) {
  const { language, ...restQueryObject } = queryObject;

  const mergedQueryObject = {
    q:
      language && language == "All"
        ? "stars:3E1"
        : `stars:3E1+language:${language?.toLowerCase()}`,
    sort: "stars",
    order: "desc",
    type: "Repositories",
    per_page: 10,
    page: 1,
    ...restQueryObject,
  };

  const query = queryString.objectToQueryString(mergedQueryObject);
  return request.get(`/search/repositories?${query}`, {
    accept: "application/vnd.github.v3+json",
  });
}