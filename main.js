const QQBot = require('./lib/QQBot.js');
const http = require('http');

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

function jinkohChishohAnswer(question) {
    let answer = question;

    if(answer.search(/[一-龥][？\?]/g) > -1) {
        answer = answer.replace(/([啊吗嗎吧呢的]+)?[？\?]/g, "！").replace(/我/g, "\uD800").replace(/[你您]/g, "我").replace(/\uD800([^\uDC00-\uDFFF])|\uD800$/g, "你$1").replace(/(.)[不没沒]\1/g, "$1").replace(/难道/g, "当然").replace(/難道/g, "當然").replace(/哪里/g, "台湾").replace(/哪[裏裡]/g, "台灣").replace(/[谁誰]/g, "蔡英文").replace(/究竟[^然]|究竟$|到底/g, "就").replace(/为什么/g, "因为非常大颗").replace(/為什麼/g, "因為非常大顆").replace(/什么/g, "竞选").replace(/什麼/g, "競選");
    };

    if(answer.search(/[a-zA-Zａ-ｚＡ-Ｚ][？\?]/g) > -1) {
        if(answer.search(/^[cCｃＣ][aAａＡ][nNｎＮ]/g) > -1) {
            answer = "Yes, I can!";
        };
    };

    return answer;
};

function jinkohChishoh() {
    qqbot.on('GroupMessage', async (rawdata) => {
        if (rawdata.extra.ats.indexOf(config.id) > -1) {
            let question = rawdata.text.replace(new RegExp(`@${config.id} ?`, "g"), "");
            let answer = jinkohChishohAnswer(question);

            if(answer !== question) {
                if (config.sleep === undefined ? true : config.sleep) {
                    await sleep((config.sleep || 100) * [...answer].length);
                };

                qqbot.sendGroupMessage(rawdata.group, `[CQ:at,qq=${rawdata.from}] ${answer}`, {noEscape: true});
                pluginManager.log(`Output: @${rawdata.user.groupCard || rawdata.user.name || rawdata.user.qq.toString()} ${answer}`);
            };
        };
    });

    qqbot.on('PrivateMessage', async (rawdata) => {
        let question = rawdata.text;
        let answer = jinkohChishohAnswer(question);

        if(answer !== question) {
            if (config.sleep === undefined ? true : config.sleep) {
                await sleep((config.sleep || 100) * [...answer].length);
            };

            qqbot.sendPrivateMessage(rawdata.from, answer);
            pluginManager.log(`Output: ${answer}`);
        };
    });
};

function AIxxz() {
    let appid = "dcXbXX0X";
    let ak = "5c011b2726e0adb52f98d6a57672774314c540a0";
    let token = "f9e79b0d9144b9b47f3072359c0dfa75926a5013";
    let devid = "UniqueDeviceID";
    qqbot.on('GroupMessage', (rawdata) => {
        if (rawdata.extra.ats.indexOf(config.id) > -1) {
            let question = rawdata.text.replace(new RegExp(`@${config.id} ?`, "g"), "");

            let reqUK = http.request({host: 'get.xiaoxinzi.com', path: '/app_event.php', method: 'POST', headers: {'content-type': 'application/x-www-form-urlencoded'}}, (res) => {
                res.on('data', (chunk) => {
                    let uk = JSON.parse(chunk.toString()).data.UniqueDeviceID.uk;

                    let reqAnswer = http.request({host: 'ai.xiaoxinzi.com', path: '/api3.php', method: 'POST', headers: {'content-type': 'application/x-www-form-urlencoded'}}, (res) => {
                        res.on('data', async (chunk) => {
                            answer = JSON.parse(chunk.toString()).data;

                            if (config.sleep === undefined ? true : config.sleep) {
                                await sleep((config.sleep || 100) * [...answer].length);
                            };

                            qqbot.sendGroupMessage(rawdata.group, `[CQ:at,qq=${rawdata.from}] ${answer}`, {noEscape: true});
                            pluginManager.log(`Output: @${rawdata.user.groupCard || rawdata.user.name || rawdata.user.qq.toString()} ${answer}`);
                        });
                    });
                    reqAnswer.write(`app=${appid}&dev=${devid}&uk=${uk}&text=${question}`);
                    reqAnswer.end();
                });
            });
            reqUK.write(`secret=${appid}|${ak}|${token}&event=GetUk&data=["${devid}"]`);
            reqUK.end();
        };
    });

    qqbot.on('PrivateMessage', (rawdata) => {
        let question = rawdata.text;

        let reqUK = http.request({host: 'get.xiaoxinzi.com', path: '/app_event.php', method: 'POST', headers: {'content-type': 'application/x-www-form-urlencoded'}}, (res) => {
            res.on('data', (chunk) => {
                let uk = JSON.parse(chunk.toString()).data.UniqueDeviceID.uk;

                let reqAnswer = http.request({host: 'ai.xiaoxinzi.com', path: '/api3.php', method: 'POST', headers: {'content-type': 'application/x-www-form-urlencoded'}}, (res) => {
                    res.on('data', async (chunk) => {
                        answer = JSON.parse(chunk.toString()).data;

                        if (config.sleep === undefined ? true : config.sleep) {
                            await sleep((config.sleep || 100) * [...answer].length);
                        };

                        qqbot.sendPrivateMessage(rawdata.from, answer);
                        pluginManager.log(`Output: ${answer}`);
                    });
                });
                reqAnswer.write(`app=${appid}&dev=${devid}&uk=${uk}&text=${question}`);
                reqAnswer.end();
            });
        });
        reqUK.write(`secret=${appid}|${ak}|${token}&event=GetUk&data=["${devid}"]`);
        reqUK.end();
    });
};

if (config.mode === "active") {
    daapenActive();                     // 主动打喷
} else if (config.mode === "passive") {
    daapenPassive();                    // 被动打喷
} else if (config.mode === "chishoh") {
    jinkohChishoh();                    // 人工智障（Jinkō Chishō），现代日本语与「人工池沼」同音
                                        // 或许也可以用国语罗马字，叫 Rengong Jyhjanq，甚至 Rengong Chyrjao
} else if (config.mode === "AIxxz") {
    AIxxz();                            // 小信子，真·人工池沼
};
