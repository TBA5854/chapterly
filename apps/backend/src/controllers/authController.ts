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
                    let user = await prisma.user.findUnique({ where: { authId: profile.id } });

                    if (!user) {
                        console.log(profile);
                        user = await prisma.user.create({
                            data: {
                                regno: profile.displayName.split(" ").pop(),
                                name: profile.name?.givenName || profile.displayName,
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
    passport.authenticate("google", { scope: ["profile", "email"],hostedDomain:"vitstudent.ac.in" })
  );
  
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
      (req, res) => {
        console.log(req.user.token);
          const token = req.user.token as any;
          res.cookie("token", token);
          const user= req.user;
          //   res.redirect(`http://localhost:3001/auth/sign-in?token=${token}`);
          res.json({ token, user });
    }
  );

app.get(
    "/checkUser", isLoggedin,(req, res) => {
    const authHeader = req.headers.authorization!;
        const id = authHeader.split(' ')[1]
        const user = prisma.user.findUnique({
            where:{authId:id}
        })
        if (!user) {
            res.status(200).json({"Info":"New User"})
        } else {
            res.status(200).json({"Info":"OK"})
        }
    }
)

export default app;
  
