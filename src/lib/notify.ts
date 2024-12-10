
export function sendNotification(title: string, text: string) {
    const img = "./favicon.ico";
    const notification = new Notification(title, { body: text, icon: img });

    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          notification.close();
        }
    });
}