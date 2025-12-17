import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { keyword } = await req.json();

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Buatkan 3 kalimat promosi tentang ${keyword} dalam format nomor langsung dan tidak usah ada intro penjelasan darimu, juga tidak usah ada gaya tulisan bold atau italic dan lain lain`
                            }
                        ]
                    }
                ]
            }),
        }
    );

    const data = await res.json();
    return NextResponse.json(data);
}
