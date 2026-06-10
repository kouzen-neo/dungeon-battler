const os = require('os');
try {
  os.networkInterfaces = () => ({
    lo: [{
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    }]
  });
} catch (e) {
  console.error("Failed to shim networkInterfaces", e);
}
