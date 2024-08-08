import { NewUser } from "@prisma/client";

type NewSession = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: number;
  user: NewUser;
};

// Function to read cookies
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// TODO: maybe not the best way todo this?
export async function slim_auth(): Promise<NewSession | null> {
  try {
    // Retrieve the user cookie
    const userCookie = getCookie('user');
    if (!userCookie) return null;

    // Parse the cookie JSON into a NewSession object
    const session = JSON.parse(userCookie) as NewSession;

    // Check if the session is valid
    if (session && session.userId) {
      return session;
    }
    return null;
  } catch (error) {
    console.error('Error parsing session cookie:', error);
    return null;
  }
}