import { auth } from "@/backend/database";


export async function GET(request: Request) {
    try {
        
        // check if the user is signed in
        const user = auth.currentUser;
        // if no user is returned, then the user is not signed in
        if (!user) {
            return new Response('User not found', { status: 404 })
        }
        console.log(user);
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error: any) {
        console.error(error)
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })
    }
}