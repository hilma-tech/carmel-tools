
export default function NtfFactory() {
    var instance;
    return {
        getNtfInstance: () => {
            if (!instance)
                instance = new NtfObserver();

            return instance;
        }
    }
}

class NtfObserver {

    subsList = [];
    constructor() {

        if ("serviceWorker" in navigator) {
            this.registerAndSubscribe().catch(err => console.error(err));
        }
        // this.subsList = [];
        const self = this;
        navigator.serviceWorker.addEventListener('message', function (event) {
            console.log("Client 1 Received Message: " + event.data);
            console.log("subs list:", self.subsList);
            self.subsList.forEach(sub => {
                if (event.data.model.toLowerCase() == sub.model.toLowerCase())
                    sub.callback(event.data);
            });
            //event.ports[0].postMessage("Client 1 Says 'Hello back!'");
        });


    }

    subscribeModel = (modelName, callback) => {
        this.subsList.push({ model: modelName, callback: callback });
    }

    publicVapidKey =
        "BPXzLbCTbOPmJ7mVu_7rY1sJJQdsVHn7TrSVkB6b_we_dkhGxAcBRCDCtUAu-xS1AfnJrN9MGzZqb5heskpX0P8";

    // Register SW, Register Push, Send Push
    registerAndSubscribe = async function () {
        // Register Service Worker
        console.log("Registering service worker...");
        const register = await navigator.serviceWorker.register("/worker.js", {
            scope: "/"
        });
        console.log("Service Worker Registered...");

        // Register Push
        console.log("Registering Push...");
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(this.publicVapidKey)
        });
        console.log("Push Registered...");

        // Send Push Notification
        console.log("subs", subscription);
        let resp = await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: {
                "content-type": "application/json",
            }
        });
        console.log("RESP!", resp);
    }


}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
