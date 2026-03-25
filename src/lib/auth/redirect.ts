const ALLOWED_REDIRECTS = ["/dashboard", "/recipes", "/meals"] as const;

export function isValidRedirect(
  path: unknown,
): path is (typeof ALLOWED_REDIRECTS)[number] {
  return (
    typeof path === "string" &&
    ALLOWED_REDIRECTS.includes(path as (typeof ALLOWED_REDIRECTS)[number])
  );
}

export function getRedirectUrl(searchParams: URLSearchParams): string {
  const redirect = searchParams.get("redirect");
  return isValidRedirect(redirect) ? redirect : "/dashboard";
}
