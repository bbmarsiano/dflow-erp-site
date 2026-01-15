/**
 * Navigate to a page using hash-based routing
 * @param path - Path like "/admin", "/insights", "/insights/some-slug", "/cookies", "/privacy"
 */
export function navigateToPage(path: string) {
  window.location.hash = path;
}
