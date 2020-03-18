import * as admin from 'firebase-admin';

const serviceAccount: any = {
  type: 'service_account',
  project_id: 'plico-dev',
  private_key_id: '810e4d2b1f2e5f8870a614923791360e8ac202fb',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCZ5Y0pyp1NABKc\njJCG15D3fQOhlFU10RTRVWstE7u7Hor08SOjyGO0epJVqKdk0hF4YTZle/lEHsq9\n0FdMlyU7UqZibNqkZDtV42qrDGDERezHnO2T2swQNPzy5bSNn692I364G0oWt9tI\nmLu/4ART8qE2XAOr5EQSepWP/DjNP457k1Gc/DixBnQmevN2jRzRUixTuUuNLFzV\nQd3bpAovbPDxPGagGxUuvPoCKnq3w/tcQ7mkgjYI4Bub3X1F7vqU7/zzyR7/llGz\nB0A936XGC9j6vgRJfQy2iv+zLxWKyEdBXuYW+0QscutBEJv/DVvwAczej/vboAJg\nfIl9/qp5AgMBAAECggEANV5UmMSJzjUTPzTDve8td5Xj13nAHvyVso5jr2sjdB2A\nZLbm/Bo28VR8QLZO7nim1E8p9QGMDKJ8/lwsmgPkRnE//+vt2opjxUIrMIwHVqlF\nFmgGP3rlv00Q1w7vkRlqWJawkBnulHhH1CIbIcwG1DHU1CwOneJ39MyL5zW5YPt6\nvD9YdRGEqIUjaAiwFDxUjcpcgqzPVIxninvmKcivEH6zPqlG1poZGcy1q+MWh4FB\nvK03MBqIAiFGFjH5w+561SQF6ZjOyn8v1xm7JEpWrsiIMNU1UKSsoiuIjAUqWLHF\nE4oGAH3i6Is4eJTzxZEqUzoiXn/RBChxGq7k+xBRvQKBgQDGmzCAVtR3tR/WzlbL\nQfLkImD8Je56W4iwCYPyxmIT9UqBoW1fNWEnbUuIJoiBDHHG5n2OJx6odl5GrBGS\n0cuCPSeKvTSSCQjyFse2xiBzcG9ouCC3DtdQib6FKx3stV0u6RVbs4YEVToiLOyg\njgu/N0mua0UCl7cZ+srJYpKUywKBgQDGXsTI9NndjKWzQyqWbQf4YuYfmQAs4ULw\nBX/Yem8QrFsBmFJDBE1eS/i7pH9bG8vA5AoMkO9w6KyzXUK93Cj7HM48PWAt5tEF\nptdf8qq9wrDIJnA4j6KrCGFCLpxKO8BvTO6QuXMdrtmGRffj8EfM3Cxs+g4NK1Zq\nLmMv1ifZSwKBgDC1VOLU6MznDgT3nA/Df9d1mwWcI+28TzylSMgc4Wb1rK04MwO7\nqrUpt/GPScEklS7rznUzoPA9/4cjoje43kl1yCHdn2wFbT06Wwa3drP5KkmrhtJ+\ngE4PSjuMxI0OOelMXuGbmM2tPVGuZOZHkBf4bkippEYrgUuM13kmhL6bAoGBAIyY\nBF7tczBcC+DWvOtqkViRN8qzVPV6Hkghja/vbqJhlgq2W69V8EPiEoNjnkQDmlC3\nDwxC+QGMV0K02aXY0U7Q5ra5RV6jFggsbL97LVpbD5J789OSsdcIlG4kvO68FLKN\n0xPN7HHgSBmro3rxBOKENhRy0dyxl4igIfp4jTurAoGATofmHqmabHRwzgxEIa1q\nqfbEEc2g/s+CGsoBXOjLJOF0qP6jgcZq9t5uDEQjkbTkBxG717rb7hpKHm0k5P2A\nGMwmpTkFJUn/2RmorBsv9gTuHKJ0oJmUBN50gfno+v0MfAu8VrEl5Vui8f4/gN9/\nPIpClW2nifDRaxWd6F7goUI=\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-hnz1s@plico-dev.iam.gserviceaccount.com',
  client_id: '114059786236077549932',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hnz1s%40plico-dev.iam.gserviceaccount.com'
};

const databaseURL = 'https://plico-dev.firebaseio.com';
const storageBucket = 'plico-dev.appspot.com';

export function initFirebase() {
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL,
    storageBucket
  });
}
