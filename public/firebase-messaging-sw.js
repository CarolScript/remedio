importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

// 📌 Inicializa o Firebase no Service Worker
firebase.initializeApp({
    apiKey: "AIzaSyAVuD_EkWMaG5GkHFRoGiemqJ9iksketdg",
    authDomain: "remedios-meu-amor.firebaseapp.com",
    projectId: "remedios-meu-amor",
    storageBucket: "remedios-meu-amor.firebasestorage.app",
    messagingSenderId: "12551340100",
    appId: "1:12551340100:web:f5e554d163d617a0307c11",
    measurementId: "G-WETS829TGW"
});

const messaging = firebase.messaging();

// 📌 Receber Notificações em Segundo Plano
messaging.onBackgroundMessage((payload) => {
    console.log("📢 Notificação Recebida em Segundo Plano:", payload);
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
    });
});

