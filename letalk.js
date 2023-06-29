const { Client,  LocalAuth } = require('./index');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

const sendToletalk = (number) => axios.post("https://webhook.letalk.com.br/813aa2c0-4c1d-4be4-88ef-9295a69132e7",
    {
        "contact": {
        "phone": "\"" + number +"\"",
        
        },
        
    })


const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: { 
        args: ['--no-sandbox','--disable-setuid-sandbox']
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        
        
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message', async msg => {
    if (msg.body) {
        const chat = await msg.getChat();
        // simulates typing in the chat
        chat.sendStateTyping();
        // Send a welcome msg
        setTimeout(() => msg.reply(`Olá, seja muito bem-vindo a ESCM! Logo o responsável pelo seu atendimento entrará em contato através do número 47 92001-4644.`), 2000);
        // Direct send a new message to specific id
        let contact = await msg.getContact();
        let contactNumber = await contact.getFormattedNumber();
        setTimeout(() => sendToletalk(contactNumber), 3000);
        // let number = msg.body.split(' ')[1];
        // let messageIndex = msg.body.indexOf(number) + number.length;
        // let message = msg.body.slice(messageIndex, msg.body.length)+ " " + contactNumber + msg.body;
        // number = number.includes('@c.us') ? number : `${number}@c.us`;
        // let chat = await msg.getChat();
        // chat.sendSeen();
        // client.sendMessage(number, message);

    } 
});

client.on('message_create', (msg) => {
    // Fired on all message creations, including your own
    if (msg.fromMe) {
        // do stuff here
    }
});


client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});



client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});



client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});




