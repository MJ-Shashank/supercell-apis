const axios = require('axios');

module.exports.getIP = async () => {

    const urls = [
        'https://myexternalip.com/raw',
        'https://ifconfig.co/ip',
    ];

    for (const url of urls) {
        let data = await axios.get(url).then(res => res.data);
        if (data && data.match(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/)) {
            return data.trim().toString();
        }
    }
};



