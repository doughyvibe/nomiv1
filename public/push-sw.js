/* ponytail: minimal dashboard push SW — no offline cache; push + notification click only */

// Chrome installability requires a fetch handler (network default; no caching).
self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  let payload = { title: "Nomi", body: "", url: "/orders" };
  try {
    payload = { ...payload, ...event.data?.json() };
  } catch {
    /* ignore malformed payload */
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icon.svg",
      badge: "/icon.svg",
      data: { url: payload.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/orders";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if ("navigate" in client) {
            return client.focus().then(() => client.navigate(url));
          }
          if ("focus" in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      }),
  );
});
