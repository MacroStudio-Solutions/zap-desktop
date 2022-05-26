const makeCert = require('mkcert');
const { existsSync, writeFileSync } = require("fs");

const { getDir } = require("../utils/rootDirs");
const { readFileSync } = require('original-fs');
const log = require("../utils/log")

const KEY_PATH = getDir("cert") + "/key.pem";
const CERT_PATH = getDir("cert") + "/cert.pem";
const ENCODE = "utf8;"

const createCertificate = () => {
  if (existsSync(CERT_PATH)) return;

  const ca = await makeCert.createCA({
    organization: 'MacroStudio',
    countryCode: 'BR',
    state: 'Mato Grosso do Sul',
    locality: 'Campo Grande',
    validityDays: 365
  });

  const cert = await makeCert.createCert({
    domains: ['127.0.0.1', 'localhost'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  });

  writeFileSync(KEY_PATH, cert.key, ENCODE);
  writeFileSync(CERT_PATH, cert.cert, ENCODE);

  log("Certificate created")
}

const getCert = () => {
  if (!existsSync(KEY_PATH)) {
    try {
      createCertificate();
    } catch (e) {
      log("Failed to create SSL certificate")
      console.log(e);
    }
    return {}
  };

  const keyPem = readFileSync(KEY_PATH, ENCODE);
  const certPem = readFileSync(CERT_PATH, ENCODE);
  
  return {
    key: keyPem,
    cert: certPem
  }
}

module.exports = { createCertificate, getCert };