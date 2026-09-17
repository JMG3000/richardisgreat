import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({
    authorization: { params: { prompt: "select_account" } }
  })],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.sub) token.accountSubject = profile.sub;
      delete token.email;
      delete token.name;
      delete token.picture;
      return token;
    },
    async session({ session, token }) {
      session.user = { authenticated: true };
      session.accountSubject = token.accountSubject;
      return session;
    }
  },
  pages: { signIn: "/" }
});
