import config from "../config";
import { mountedRootComponent } from "../App";

export default async function authenticatedFetch(route, init) {
  // route must be without starting or trailing slash

  const jwtToken = localStorage.getItem(`${config.localStorageName}-jwtToken`);

  const response = await fetch(
    `${config.back.url}/${route}/?jwtToken=${jwtToken}`,
    init,
  );

  if (response.status === 401) mountedRootComponent.showLogin();

  if (!response.ok) throw Error(response.statusText);

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  }
  return null;
}
