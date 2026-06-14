const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');

mongoose.connect("")
    .then(() => console.log("Connected!"))
    .catch(err => console.error("Failed:", err));