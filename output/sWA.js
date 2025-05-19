console.clear();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const readline = require('readline-sync');
const chalk = require('chalk');
const figlet = require('figlet');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3001;

// 🧠 WebSocket server buat kirim QR ke frontend
const wss = new WebSocket.Server({ port: PORT });
let wsClient = null;

wss.on('connection', (ws) => {
    console.log(chalk.yellow('[WS] Frontend terhubung!'));
    wsClient = ws;
});

function typeEffect(text, delay = 30) {
    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            process.stdout.write(text.charAt(i));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                process.stdout.write('\n');
                resolve();
            }
        }, delay);
    });
}

(async () => {
    console.log(chalk.cyan(figlet.textSync('V-Tools', { horizontalLayout: 'fitted' })));
    console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

    await typeEffect(chalk.white("🔧 Tool      : WhatsApp Spammer Chat"));
    await typeEffect(chalk.white("🧠 Deskripsi : Kirim pesan otomatis ke target WA setiap 0.5 detik"));
    await typeEffect(chalk.white("🧑💻 Dev     : Putra | V-Pendulum Project"));
    await typeEffect(chalk.white("🌐 Project   : https://vpendulums.vercel.app/home.html"));

    console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"));

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: 'VToolsSession'
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    // 🟡 Saat QR muncul
    client.on('qr', async (qr) => {
        const qrDataUrl = await qrcode.toDataURL(qr);
        console.log(chalk.yellow('\n[!] QR Code dibuat, mengirim ke frontend...\n'));

        if (wsClient && wsClient.readyState === WebSocket.OPEN) {
            wsClient.send(JSON.stringify({
                type: 'qr',
                data: qrDataUrl
            }));
        } else {
            console.log(chalk.red('[X] Tidak ada frontend terhubung via WebSocket!'));
        }
    });

    // ✅ Login sukses
    client.on('ready', async () => {
        console.log(chalk.green("\n[✓] Berhasil login ke WhatsApp!\n"));

        const target = readline.question(chalk.cyan('[>] Nomor target (contoh: 628xxxx): '));
        const message = readline.question(chalk.cyan('[>] Pesan yang ingin dikirim: '));
        const jumlah = readline.questionInt(chalk.cyan('[>] Jumlah pesan: '));

        const chatId = `${target}@c.us`;

        for (let i = 1; i <= jumlah; i++) {
            await client.sendMessage(chatId, message);
            console.log(chalk.green(`[✓] [${i}/${jumlah}] Pesan terkirim ke ${target}`));
            await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 detik jeda
        }

        console.log(chalk.magentaBright('\n[✓] Semua pesan telah dikirim!'));
        process.exit(0);
    });

    // ❌ Gagal login
    client.on('auth_failure', msg => {
        console.error(chalk.red(`[!] Gagal otentikasi: ${msg}`));
        console.log(chalk.red('[!] Coba hapus folder .wwebjs_auth atau pastikan tidak corrupt.'));
    });

    // 🔴 Disconnect
    client.on('disconnected', reason => {
        console.log(chalk.red(`[!] Terputus dari WhatsApp: ${reason}`));
    });

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });

    client.initialize();
})();
