console.clear();

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline-sync');
const chalk = require('chalk');
const figlet = require('figlet');

// ⚡ ANIMASI KETIKAN
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

// 🚀 MAIN EXEC
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
            clientId: 'VToolsSession' // 👉 Session tetap pakai ID ini
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        }
    });

    // ⏳ Saat muncul QR
    client.on('qr', qr => {
        console.log(chalk.yellow("\n[!] Silakan scan QR berikut untuk login sekali:"));
        qrcode.generate(qr, { small: true });
    });

    // ✅ Berhasil login
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

    // ❌ Kalau gagal auth
    client.on('auth_failure', msg => {
        console.error(chalk.red(`[!] Gagal otentikasi: ${msg}`));
        console.log(chalk.red('[!] Coba hapus folder .wwebjs_auth atau pastikan tidak corrupt.'));
    });

    // ℹ Info saat disconnect
    client.on('disconnected', reason => {
        console.log(chalk.red(`[!] Terputus dari WhatsApp: ${reason}`));
    });

    client.initialize();
})();
