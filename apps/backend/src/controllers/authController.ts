import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../db/dbController";
import { Router } from "express";
import isLoggedin from "../middlewares/authMiddleware";

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function init() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "https://chapterly.onrender.com/auth/google/callback",
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {

            console.log(profile);
            const user= await prisma.user.create({
              data: {
                regno: profile.displayName.split(" ").pop(),
                name: profile.name?.givenName || profile.displayName,
                email: profile.emails?.[0].value || "",
                isExc: false,
                role: "Jr",
                phno: "",
              },
            });
          

          const token = jwt.sign({ regno: user.regno }, SECRET, {
            expiresIn: "1h",
          });
          done(null, {
            user,
            token,
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

const app = Router();
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    hostedDomain: "vitstudent.ac.in",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log(req.user.token);
    const token = req.user.token as any;
    res.cookie("token", token);
    const user = req.user;
    const redirectUrl = req.query.state;
    //   res.redirect(`http://localhost:3001/auth/sign-in?token=${token}`);

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

app.get("/checkUser", isLoggedin, (req, res) => {
  const authHeader = req.headers.authorization!;
  const id = authHeader.split(" ")[1];
  const user = prisma.user.findUnique({
    where: { authId: id },
  });
  if (!user) {
    res.status(200).json({ Info: "New User" });
  } else {
    res.status(200).json({ Info: "OK" });
  }
});

app.get("/login", isLoggedin, (req, res) => {
  const details = req.user;
  const user = prisma.user.findUnique({
    where: { email: details.email },
  });
  const token = jwt.sign({ email: details.email }, SECRET, { expiresIn: "1y" });
  if (!user) {
    try {
      prisma.user.create({
        data: {
          email: details.email,
          name: details.name,
          role: "Jr",
          isExc: false,
          phno: "",
          regno: "",
          authId: details.id,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
      return;
    }
    res.status(200).json({ token, is_first_time: true, message: "New User" });
  } else {
    res.status(200).json({ token, is_first_time: false, message: "Old User" });
  }
});

export default app;
