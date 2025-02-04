import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../db/dbController";
import { Router } from "express";


const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function init() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: "https://chapterly.onrender.com//auth/google/callback",
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    let user = await prisma.user.findUnique({ where: { authId: profile.id } });

                    if (!user) {
                        console.log(profile);
                        user = await prisma.user.create({
                            data: {
                                regno: profile.id,
                                name: profile.displayName,
                                email: profile.emails?.[0].value || "",
                                authId: profile.id,
                                isExc: false,
                                role: "Jr",
                                phno: "",
                            },
                        });
                    }

                    const token = jwt.sign({ regno: user.regno }, SECRET, { expiresIn: "1h" });
                    done(null, { user, token });
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
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
      (req, res) => {
        console.log(req.user.token);
          const token = req.user.token as any;
        res.cookie("token", token);
      res.redirect(`http://localhost:3001/auth/sign-in?token=${token}`);
    }
  );
  export default app;