import { auth } from "@/backend/database";
import { signInWithEmailAndPassword, getIdToken } from "firebase/auth";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        // Get the ID token from the user
        const idToken = await getIdToken(user);
        // if no user is returned, then the user is not signed in
        if (!user) {
            return new Response('User not found', { status: 404 })
        }
        console.log(user);
        return new Response(JSON.stringify({ user, idToken }), { status: 200 })
    } catch (error: any) {
        console.error(error)
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })
    }
}
