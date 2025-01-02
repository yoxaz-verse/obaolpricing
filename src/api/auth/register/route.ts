import { auth } from "@/backend/database";
import { createUserWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {

    try {
        const { email, password } = await request.json();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed in
        const user = userCredential.user;
        return Response.json({ user });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })

    }
}
