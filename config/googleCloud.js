const Cloud = require("@google-cloud/storage");
require("dotenv").config();
const {
  GC_TYPE,
  GC_PROJECT_ID,
  GC_PRIVATE_KEY_ID,
  GC_PRIVATE_KEY,
  GC_CLIENT_EMAIL,
  GC_CLIENT_ID,
  GC_AUTH_URI,
  GC_TOKEN_URI,
  GC_AUTH_PROVIDER_X509_CERT_URL,
  GC_CLIENT_X509_CERT_URL,
} = process.env;

const { Storage } = Cloud;

const storage = new Storage({
  projectId: "broken-office",
  credentials: {
    type: GC_TYPE,
    project_id: GC_PROJECT_ID,
    private_key_id: GC_PRIVATE_KEY_ID,
    private_key: GC_PRIVATE_KEY,
    client_email: GC_CLIENT_EMAIL,
    client_id: GC_CLIENT_ID,
    auth_uri: GC_AUTH_URI,
    token_uri: GC_TOKEN_URI,
    auth_provider_x509_cert_url: GC_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: GC_CLIENT_X509_CERT_URL,
  },
});

module.exports = storage;
