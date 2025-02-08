// const jwt = require("jsonwebtoken");
// const jwksClient = require("jwks-rsa");

// const client = jwksClient({
//   jwksUri: "https://www.googleapis.com/oauth2/v3/certs",
// });

// function getKey(header, callback) {
//   client.getSigningKey(header.kid, (err, key) => {
//     if (err) {
//       return callback(err);
//     }
//     const signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// }

// async function verifyAccessToken(token) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
//       if (err) {
//         return reject("Invalid Access Token");
//       }
//       resolve(decoded);
//     });
//   });
// }

// // Example usage
// verifyAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWdubyI6IjExMDg5ODIwMDYzOTc5MzQwMjE4MCIsImlhdCI6MTczODk5ODYxNiwiZXhwIjoxNzM5MDAyMjE2fQ._cx143NkRbP1nIZ0x0t89fm08laU07wjjvTsOBerl0")
//   .then(decoded => console.log("Decoded Token:", decoded))
//   .catch(err => console.error(err));

// // const { OAuth2Client } = require("google-auth-library");
// // const googleClient = new OAuth2Client("YOUR_GOOGLE_CLIENT_ID");

// // async function verifyIdToken(idToken) {
// //   const ticket = await googleClient.verifyIdToken({
// //     idToken: idToken,
// //     audience: "85863193719-ian6uhreq42j6hmu0u7iko4p09u2man4.apps.googleusercontent.com", // Replace with your client ID
// //   });

// //   const payload = ticket.getPayload();
// //   console.log("Verified ID Token:", payload);
// //   return payload;
// // }

// // // Example usage
// // verifyIdToken("ya29.a0AXeO80TDLSv84XMnhK2qwYZnCUJmFhzuR4mHwF1VPpVNmiIjGenFmxIk_bCSQrzLLo1aQPVWBmTQxrRPDb6I89oC261Sqih-DTmFbTCMWfGB_WLw1KjnjIVvimT5Y-zsJ1F3j-vPEp2TsYbYLaGw9YOn1QyHjWksercIm2zmaCgYKAd0SARASFQHGX2MiOcodm9VQzdLDnnRSEHvY5w0175")
// //   .then(user => console.log(user))
// //   .catch(err => console.error("Invalid Token:", err.message));


import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async function verifyGoogleAccessToken(accessToken) {
    const ticket = await googleClient.getTokenInfo(accessToken);
    console.log("Token Info:", ticket);
    return ticket;
  }

console.log(  verifyGoogleAccessToken("ya29.a0AXeO80TDLSv84XMnhK2qwYZnCUJmFhzuR4mHwF1VPpVNmiIjGenFmxIk_bCSQrzLLo1aQPVWBmTQxrRPDb6I89oC261Sqih-DTmFbTCMWfGB_WLw1KjnjIVvimT5Y-zsJ1F3j-vPEp2TsYbYLaGw9YOn1QyHjWksercIm2zmaCgYKAd0SARASFQHGX2MiOcodm9VQzdLDnnRSEHvY5w0175"))