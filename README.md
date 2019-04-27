# sw-back-online

## Generating a new ssl cert for local development

### Generate a new cert

```sh
openssl req -x509 -out test/cert.pem -keyout test/key.pem \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

From https://letsencrypt.org/docs/certificates-for-localhost/

### Trust cert locally (OSX)

1. Double-click `cert.pem` to add to Keychain Access
1. Find freshly added `localhost` key, open it
1. Open `trust` section and mark `When using this certificate:` as `Trust always`
