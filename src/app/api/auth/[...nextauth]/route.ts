import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      
      token: "https://graph.facebook.com/v19.0/oauth/access_token",

      authorization: {
        url: "https://www.facebook.com/v19.0/dialog/oauth",
        params: {
          config_id: process.env.FACEBOOK_CONFIG_ID!,
          response_type: "code",
          override_default_response_type: true,

          scope: "public_profile,email",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },

  debug: true,
});

export { handler as GET, handler as POST };
