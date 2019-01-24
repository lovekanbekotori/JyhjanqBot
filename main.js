const QQBot = require('./lib/QQBot.js');

const pluginManager = {
    log: (message, isError = false) => {
        let date = new Date().toISOString();
        let output = `[${date.substring(0,10)} ${date.substring(11,19)}] ${message}`;

        if (isError) {
            console.error(output);
        } else {
            console.log(output);
        }
    },
};

const config = require('./config.js');

let qqbot = new QQBot({
    host: config.host || '127.0.0.1',
    port: config.port || 11235
});
pluginManager.log('Starting QQBot...');

qqbot.on('Error', (err) => {
    pluginManager.log(`QQBot Error: ${err.error.toString()} (${err.event})`, true);
});

qqbot.start();

let penshern = [];
let penshernCopy = [];
try {
    penshern = require('./text.js');
} catch (ex) {
    pluginManager.log('Failed to load text.js', true);
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

async function daapenActive() {
    for (let i = 1; i <= (config.count || 100); i ++) {
        if (penshernCopy.length === 0) {
            penshernCopy.push(...penshern);                                // 若 penshernCopy 为空，将 penshern 内容放入 penshernCopy
        };

        let ramdomIndex = Math.floor(Math.random() * penshernCopy.length); // 生成随机数
        let random = penshernCopy[ramdomIndex];                            // 用这个随机数来从 penshernCopy 抽取喷辞

        if (config.sleep === undefined ? true : config.sleep) {
            await sleep((config.sleep || 100) * [...random].length);       // 延时
        };

        if (config.isGroup === undefined ? true : config.isGroup) {
            qqbot.sendGroupMessage(config.to, random);                     // 群聊
        } else {
            qqbot.sendPrivateMessage(config.to, random);                   // 私聊
        };
        pluginManager.log(`Output: ${random}`);

        if (config.unique) {
            penshernCopy.splice(ramdomIndex, 1);                           // 从 penshernCopy 里删除用掉的喷辞
        };
    };
};

function daapenPassive() {
    qqbot.on('GroupMessage', async (rawdata) => {
        if (rawdata.extra.ats.indexOf(config.id) > -1) {
            if (penshernCopy.length === 0) {
                penshernCopy.push(...penshern);
            };

            let ramdomIndex = Math.floor(Math.random() * penshernCopy.length);
            let random = penshernCopy[ramdomIndex];

            if (config.sleep === undefined ? true : config.sleep) {
                await sleep((config.sleep || 100) * [...random].length);
            };

            qqbot.sendGroupMessage(rawdata.group, `[CQ:at,qq=${rawdata.from}] ${random}`, {noEscape: true});
            pluginManager.log(`Output: @${rawdata.user.groupCard || rawdata.user.name || rawdata.user.qq.toString()} ${random}`);

            if (config.unique) {
                penshernCopy.splice(ramdomIndex, 1);
            };
        };
    });

    qqbot.on('PrivateMessage', async (rawdata) => {
        if (penshernCopy.length === 0) {
            penshernCopy.push(...penshern);
        };

        let ramdomIndex = Math.floor(Math.random() * penshernCopy.length);
        let random = penshernCopy[ramdomIndex];

        if (config.sleep === undefined ? true : config.sleep) {
            await sleep((config.sleep || 100) * [...random].length);
        };

        qqbot.sendPrivateMessage(rawdata.from, random);
        pluginManager.log(`Output: ${random}`);

        if (config.unique) {
            penshernCopy.splice(ramdomIndex, 1);
        };
    });
};

if (config.mode === "active") {
    daapenActive();
} else if (config.mode === "passive") {
    daapenPassive();
};
