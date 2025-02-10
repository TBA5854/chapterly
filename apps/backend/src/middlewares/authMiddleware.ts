import { Request, Response, NextFunction } from 'express';
// import { OAuth2Client } from "google-auth-library";
import jwt from 'jsonwebtoken';

const isLoggedin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const details = await jwt.verify(token, process.env.JWT_SECRET!);
      console.log("Details:", details);
      req.user = (details as any).regno; // add type
      console.log("User:", req.user);
      next();
    } catch (error) {
      console.error("Error:", error);
      res.status(401).json({ error: 'Unauthorized' });
    }
};

export async function validateGidUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const details = await jwt.verify(token, process.env.JWT_SECRET!);
    req.user = (details as any).gid; // add type
    console.log("User:", req.user);
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}
// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// async function verifyGoogleAccessToken(accessToken: string): Promise<any> {
//   try {
//     const ticket = await googleClient.getTokenInfo(accessToken);
//     console.log("Token Info:", ticket);
//     return ticket;
//   } catch (error) {
//     console.error("Invalid Token:", error.message);
//     return { error: 'invalid_token' };
//   }
// }

// verifyGoogleAccessToken("ya29.a0AXeO80TDLSv84XMnhK2qwYZnCUJmFhzuR4mHwF1VPpVNmiIjGenFmxIk_bCSQrzLLo1aQPVWBmTQxrRPDb6I89oC261Sqih-DTmFbTCMWfGB_WLw1KjnjIVvimT5Y-zsJ1F3j-vPEp2TsYbYLaGw9YOn1QyHjWksercIm2zmaCgYKAd0SARASFQHGX2MiOcodm9VQzdLDnnRSEHvY5w0175")
//   .then(ticket => console.log(ticket))
//   .catch(err => console.error("Invalid Token:", err.message));
export default isLoggedin;