import { auth } from "@/backend/database";


export async function POST(request: Request) {
    try {
        await auth.signOut();
        return new Response('User signed out', { status: 200 })
    } catch (error: any) {
        console.error(error)
        return new Response(JSON.stringify({ message: error.message }), { status: 500 })
    }
}