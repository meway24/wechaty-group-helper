const {
    Wechaty,
    ScanStatus,
    log,
} = require('wechaty')

function onScan(qrcode, status) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console
    }
}

function onLogin(user) {
    log.info(`user: ${JSON.stringify(user)}`);
}

function onLogout(user) {
    log.info('StarterBot', '%s logout', user)
}


async function onMessage(msg) {
    const contact = msg.from()
    const text = msg.text()
    const room = msg.room()

    if (msg.self()) {
        return
    }

    if (room) {
        const topic = await room.topic();
        if (topic === 'xx行业群') {
            if (/广告关键字/.test(text)) {
                await room.say('本群禁止发广告', contact);
                await room.del(contact);
            }
        }
    }
}

async function onRoomJoin(room, inviteList, inviter) {
    const topic = await room.topic();
    await room.say(`欢迎加入群 "${topic}"!`, inviteList[0]);
}

const token = 'puppet_donut_*****'

const bot = new Wechaty({
    name: 'wechat-group-helper',
    puppet: 'wechaty-puppet-hostie',
    puppetOptions: {
        token,
    }
})

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);
bot.on('room-join', onRoomJoin);

bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e));