console.log("🔥 Carregando Firebase...");
console.log(typeof firebase); // Testa se Firebase foi carregado

// Verifica se Firebase está definido antes de inicializar
if (typeof firebase === "undefined") {
    console.error("❌ Firebase não carregou corretamente! Verifique os scripts no index.html.");
} else {
    console.log("✅ Firebase carregado com sucesso!");

    // 📌 Configuração do Firebase (PEGUE OS DADOS CERTOS NO FIREBASE)
    const firebaseConfig = {
        apiKey: "AIzaSyAVuD_EkWMaG5GkHFRoGiemqJ9iksketdg",
        authDomain: "remedios-meu-amor.firebaseapp.com",
        projectId: "remedios-meu-amor",
        storageBucket: "remedios-meu-amor.firebasestorage.app",
        messagingSenderId: "12551340100",
        appId: "1:12551340100:web:f5e554d163d617a0307c11",
        measurementId: "G-WETS829TGW"
    };

    // 📌 Verifica se já existe uma instância do Firebase antes de inicializar
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase Inicializado!", firebase);
    } else {
        console.log("⚠️ Firebase já estava inicializado.");
    }

    // 📌 Inicializa o Firebase Cloud Messaging
    const messaging = firebase.messaging();

    // 📌 Registrar o Service Worker para Notificações
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/firebase-messaging-sw.js")
            .then((registration) => {
                console.log("✅ Service Worker registrado com sucesso!", registration);
            })
            .catch((error) => {
                console.error("❌ Erro ao registrar Service Worker", error);
            });
    }

  


    // 📌 Função para capturar automaticamente o Token do Celular e enviar para o Firebase Firestore
function capturarTokenAutomaticamente() {
    messaging.getToken({ vapidKey: "BIMspMUff6WZxX5oyAWw9wdKWziQpwzYIAXwoA-DMaIlr3EeoBwEFRXLEJKK26hUNEjfwNTUEcSC9ifl4AA1VZA" })
        .then((token) => {
            if (token) {
                console.log("✅ Token do Celular Gerado:", token);
                salvarTokenNoFirestore(token); // Envia para o banco de dados automaticamente
            } else {
                console.warn("⚠️ Nenhum token gerado. Verifique as permissões.");
            }
        })
        .catch((error) => {
            console.error("❌ Erro ao obter Token:", error);
        });
}

// 📌 Salvar Token no Firebase Firestore
// 📌 Salvar Token no Firebase Firestore
function salvarTokenNoFirestore(token) {
    try {
        const db = firebase.firestore();  // Agora funciona!
        const userRef = db.collection("tokens").doc(token); // Usa o token como identificador único

        userRef.set({
            token: token,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("✅ Token salvo no Firestore com sucesso!");
        }).catch((error) => {
            console.error("❌ Erro ao salvar Token no Firestore:", error);
        });
    } catch (error) {
        console.error("❌ Erro ao acessar Firestore:", error);
    }
}


// 📌 Quando o usuário ativar as notificações, já captura e salva o Token
document.getElementById("ativar").addEventListener("click", function () {
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            capturarTokenAutomaticamente();
        } else {
            alert("Você precisa ativar as notificações para receber os lembretes!");
        }
    });
});
}
 
// 📌 Função para carregar os horários do JSON e exibir na tela
async function carregarHorarios() {
    try {
        const response = await fetch("horarios_remedios.json");
        const horariosRemedios = await response.json();

        console.log("✅ Horários carregados do JSON:", horariosRemedios);
        carregarRemediosNaTela(horariosRemedios);
    } catch (error) {
        console.error("❌ Erro ao carregar horários:", error);
    }
}

// 📌 Exibir os horários na tela
function carregarRemediosNaTela(horariosRemedios) {
    const container = document.getElementById("medicamentos");
    container.innerHTML = ""; 

    Object.keys(horariosRemedios).forEach((remedio) => {
        horariosRemedios[remedio].forEach((horario, index) => {
            let card = document.createElement("div");
            card.classList.add("med-card");

            let info = document.createElement("div");
            info.innerHTML = `<strong>${remedio}</strong><br><small>Horário: ${horario}</small>`;

            let btn = document.createElement("button");
            btn.textContent = "Tomado ✅";
            btn.classList.add("btn");

            let chaveLocal = `remedio_${remedio}_${index}`;
            if (localStorage.getItem(chaveLocal) === "tomado") {
                btn.classList.add("taken");
                btn.textContent = "Tomado! 🎉";
            }

            btn.onclick = function () {
                if (btn.classList.contains("taken")) {
                    btn.classList.remove("taken");
                    btn.textContent = "Tomado ✅";
                    localStorage.removeItem(chaveLocal);
                } else {
                    btn.classList.add("taken");
                    btn.textContent = "Tomado! 🎉";
                    localStorage.setItem(chaveLocal, "tomado");
                    alert(getMensagemMotivacional());
                }
            };

            card.appendChild(info);
            card.appendChild(btn);
            container.appendChild(card);
        });
    });
}

// 📌 Frases Motivacionais e Engraçadas (20 frases)
function getMensagemMotivacional() {
    const frases = [
        "💊 Parabéns! Mais um passo na recuperação! 💪",
        "😂 Seu siso pode ter ido embora, mas sua disciplina não!",
        "📖 'O Senhor é minha força' (Êxodo 15:2). Fé e dipirona sempre ajudam! 🙏💊",
        "❤️ Você sem dente ainda é a pessoa mais linda do mundo pra mim!",
        "🤣 Melhor que dor de dente é carinho do namorado (e tomar o remédio direitinho) 😍💊",
        "😆 Seu dente pode ter ido embora, mas o amor continua! 💊❤️",
        "💪 Parabéns, guerreiro sem dente! Mais um passo rumo à recuperação!",
        "🦷 O siso saiu, mas sua força interior continua! Vamos lá! 💪",
        "🙏 O sacrifício do siso já foi feito, agora falta só o remédio! 💊",
        "😂 Você sem dente continua lindo! Mas sem remédio não dá! 💊",
        "🔥 Bora lá, herói sem dente! Cada comprimido é um passo pro sucesso!",
        "💖 Cuidar da saúde é um ato de amor próprio! 💊❤️",
        "📢 Alerta de dente perdido! Tome seu remédio e continue forte! 🦷",
        "💬 Dizem que o siso traz sabedoria… Mas só se tomar o remédio certo! 😆",
        "🎉 Parabéns! Seu siso saiu e agora você pode brilhar sem dor! ✨💊",
        "😂 Já que o siso foi embora, aproveita e manda a dor junto! 💊🚀",
        "🕊️ Deus te fortalece! Mas Ele também quer que você tome o remédio! 🙏💊",
        "💊 Tomar remédio faz parte, mas pelo menos não precisa mastigar! 😂",
        "🥇 Cada dose tomada é uma vitória na recuperação! 💪💊",
        "❤️ Eu te amo, mas não vou tomar o remédio por você! Vai lá e cuida de si! 💊😜"
    ];
    return frases[Math.floor(Math.random() * frases.length)];
}

// 📌 Carregar horários ao iniciar a página
window.onload = carregarHorarios;
