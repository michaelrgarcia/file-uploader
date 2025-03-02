import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcrypt";
import { PrismaClient } from "@prisma/client";

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const prisma = new PrismaClient();

      const user = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      if (!user) {
        return done(null, false, { message: "Email not found" });
      }

      const match = await compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err: any) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (err: any) {
    done(err);
  }
});

export default passport;
