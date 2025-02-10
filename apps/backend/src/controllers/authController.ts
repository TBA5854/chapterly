import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../db/dbController";
import { Router, Request, Response } from "express";
import isLoggedin from "../middlewares/authMiddleware";
import { OAuth2Client } from "google-auth-library";
import { AuthToken } from "../types/authTypes";

interface User {
  token: string;
  [key: string]: any;
}

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function init() {
  passport.use(
    new GoogleStrategy(
      {
        scope: ["profile", "email"],
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "https://chapterly.onrender.com/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {

            console.log(profile);
            // const user= await prisma.user.create({
            //   data: {
            //     regno: profile.displayName.split(" ").pop() || "",
            //     name: profile.name?.givenName || profile.displayName,
            //     email: profile.emails?.[0].value || "",
            //     isExc: false,
            //     role: "Jr",
            //     phno: "",
            //   },
            // });
          

          // const token = jwt.sign({ regno: user.regno }, SECRET, {
          //   expiresIn: "1h",
          // });
          done(null, {
            "user":"user",
            "token":"token",
            _accessToken,
            profile,
          });
        } catch (error) {
          done(error, false);
        }
      }
    )
  );
}

const router = Router();
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    // hostedDomain: "vitstudent.ac.in",
    
  })
);

// router.post("/verify", (req, res) => {
//   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
//   console.log(process.env.GOOGLE_CLIENT_ID);
//   console.log(process.env.GOOGLE_CLIENT_SECRET);
//   client.verifyIdToken({
//     idToken: req.body.token as string,
//     audience: process.env.GOOGLE_CLIENT_ID,

//   }).then((ticket) => {

//     const payload = ticket.getPayload();
//     const userid = payload['sub'];
//     console.log(payload);
//   }).catch((error) => {
//     console.log(error);
//   });
//   res.end();
// }
// )

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as User;
    console.log(user.token);
    const token = user.token;
    res.cookie("token", token);
    const redirectUrl = req.query.state?.toString();
    console.log(redirectUrl);
    if (redirectUrl?.toString().startsWith("com.example.chapterly")) {
      // Flutter deep link callback
      res.redirect(`com.example.chapterly://auth?token=${token}`);
      console.log("Flutter deep link callback");
    } else {
      res.json({ token, user });
      console.log("Normal callback");
    }
  }
);

// app.get("/checkUser", isLoggedin, (req, res) => {
//   const authHeader = req.headers.authorization!;
//   const id = authHeader.split(" ")[1];
//   const user = prisma.user.findUnique({
//     where: { authId: id },
//   });
//   if (!user) {
//     res.status(200).json({ Info: "New User" });
//   } else {
//     res.status(200).json({ Info: "OK" });
//   }
// });

// app.get("/login", isLoggedin, (req, res) => {
//   const details = req.user;
//   const user = prisma.user.findUnique({
//     where: { email: details.email },
//   });
//   const token = jwt.sign({ email: details.email }, SECRET, { expiresIn: "1y" });
//   if (!user) {
//     try {
//       prisma.user.create({
//         data: {
//           email: details.email,
//           name: details.name,
//           role: "Jr",
//           isExc: false,
//           phno: "",
//           regno: "",
//           authId: details.id,
//         },
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Error" });
//       return;
//     }
//     res.status(200).json({ token, is_first_time: true, message: "New User" });
//   } else {
//     res.status(200).json({ token, is_first_time: false, message: "Old User" });
//   }
// });

router.post("/token", async (req: Request, res: Response) => { 
  const body = req.body;
  if (!body) {
    res.status(400).json({ message: "Body not provided" });
    return;
  }
  const token = body.token;
  if (!token) {
    res.status(400).json({ message: "Token not provided" });
    return;
  }
  const email = body.email;
  if (!email) {
    res.status(400).json({ message: "Email not provided" });
    return;
  }
  try {
    const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      res.status(400).json({ message: "Invalid token" ,token});
      return;
    }
    const tokenInfo:AuthToken = await response.json();
    if (tokenInfo.email !== email) {
      res.status(400).json({ message: "Token email does not match provided email" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const googleUser = await prisma.google.findUnique({
        where: { email },
      });
      if (!googleUser) {
        await prisma.google.create({
          data: {
            email,
            gid: tokenInfo.user_id,
          },
        });
      }
      const newToken = jwt.sign({ gid:tokenInfo.user_id }, process.env.JWT_SECRET!, { expiresIn: "1y" });
      res.status(200).json({ token: newToken, is_first_time: true, message: "New User" });
    } else {
      const existingToken = jwt.sign({ regno: user.regno }, process.env.JWT_SECRET!, { expiresIn: "1y" });
      res.status(200).json({ token: existingToken, is_first_time: false, message: "Old User" });
    }
    // res.status(200).json({ message: "Token is valid", tokenInfo });
  } catch (error) {
    
    res.status(500).json({ message: "Internal server error" });
  }
})











export default router;
