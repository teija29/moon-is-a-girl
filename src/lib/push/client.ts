function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = atob(base64);
  const ab = new ArrayBuffer(raw.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < raw.length; ++i) {
    view[i] = raw.charCodeAt(i);
  }
  return view;
}

export type AbonnementPush = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export async function creerAbonnementPush(
  clePubliqueVAPID: string
): Promise<AbonnementPush | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.ready;
  const abo = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(clePubliqueVAPID),
  });

  const json = abo.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return null;
  }

  return {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  };
}

export async function supprimerAbonnementPush(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;
  const abo = await registration.pushManager.getSubscription();
  if (!abo) return null;

  const endpoint = abo.endpoint;
  await abo.unsubscribe();
  return endpoint;
}

export function etatPermissionNotif():
  | "default"
  | "granted"
  | "denied"
  | "unsupported" {
  if (typeof window === "undefined") return "unsupported";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}
