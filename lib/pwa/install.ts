/** Browser hint for install instructions (UI copy uses friendly labels). */
export type InstallBrowserHint = "ios" | "android" | "desktop" | "unknown";

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(nav.standalone);
}

export function detectInstallBrowser(
  nav: Pick<Navigator, "userAgent" | "platform" | "maxTouchPoints"> = navigator,
): InstallBrowserHint {
  const ua = nav.userAgent;
  // iPadOS 13+ reports as MacIntel with touch
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows|Macintosh|Linux|CrOS/i.test(ua)) return "desktop";
  return "unknown";
}
