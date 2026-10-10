import { Client } from "pg";
import { NextResponse } from "next/server";

const databaseUrl = new URL(process.env.DATABASE_URL!);
databaseUrl.searchParams.delete("sslmode");export async function POST() {
console.log({
    databaseUrlLoaded: Boolean(process.env.DATABASE_URL),
    usernameFound: Boolean(databaseUrl.username),
    passwordFound: Boolean(databaseUrl.password),
    host: databaseUrl.host,
});
    const client = new Client({
        connectionString: databaseUrl.toString(),
        ssl: {
            rejectUnauthorized: false,
        },
    });

    try {
        await client.connect();

        await client.query(`
            CREATE TABLE IF NOT EXISTS connection_tests (
                id SERIAL PRIMARY KEY,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        const result = await client.query(`
            INSERT INTO connection_tests (message)
            VALUES ('Tiger Data is connected to FridgeSnap!')
            RETURNING *;
        `);

        return NextResponse.json({
            success: true,
            savedRow: result.rows[0],
        });
    } catch (error) {
        console.error("Database error:", error);

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown database error.",
            },
            { status: 500 }
        );
    } finally {
        await client.end().catch(() => {});
    }
}