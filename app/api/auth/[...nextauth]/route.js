import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@/models/User.js';
import connectDB from '@/config/database';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // called jab user is logged in
    async signIn({ profile }) { //ye google ki info hai
      await connectDB();
      // check if exists throu mail
      const userExists = await User.findOne({ email: profile.email });
      // 2. If not, create 
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name,
          image: profile.picture,
        });
      }
      // return true to allow sign in
      return true;
    },
    // Tthis is for a session
    async session({ session }) { //jab koi user login karta hai toh session details milti
      await connectDB();
      // Find the user in our database from the session email
      const user = await User.findOne({ email: session.user.email });
      // Assign the user's database ID to the session object
      session.user.id = user._id.toString(); //DB se unique user id uthali, so that backend knows konsa user hai
      // Return the modified session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };