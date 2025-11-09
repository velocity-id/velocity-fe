import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  debug: true, // <-- aktifkan debug untuk log di terminal
  // opsional: session, callbacks, adapter, dll.
});

export { handler as GET, handler as POST };
