import passport from "passport";

import { Strategy as LocalStrategy } from "passport-local";
import { compare } from "bcrypt";

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      let user: any; // query here

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
    let user: any; // query here

    done(null, user);
  } catch (err: any) {
    done(err);
  }
});

export default passport;
