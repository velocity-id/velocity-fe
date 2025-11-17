import NextAuth, { AuthOptions } from "next-auth";
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

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,

      authorization: {
        url: "https://www.facebook.com/v23.0/dialog/oauth",
        params: {
          config_id: process.env.FACEBOOK_CONFIG_ID!,
          response_type: "code",
          scope: "public_profile,email,ads_management,ads_read,business_management",
        },
      },

      client: {
        token_endpoint: "https://graph.facebook.com/v23.0/oauth/access_token",
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
