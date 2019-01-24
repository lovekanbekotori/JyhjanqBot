// 请参照注释进行设定
// 设定好之后，请将档案更名为 config.js

module.exports = {
    "host": "127.0.0.1", // 酷 Q 所在环境的 IP
    "port": 11235,       // 酷 Q 的通信端口
    "isGroup": true,     // true 为群，false 为私聊
    "id": "10000",       // QQ 群号或 QQ 号
    "count": 100,        // 消息总数
    "sleep": 100,        // 单字符延时（毫秒），单字符延时 × 字符数 = 字符串延时
    "unique": false      // true 则喷辞不重复（文本用尽后会重置），false 允许重复
};
