import { NextRequest, NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "default";

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        essays: [],
        isMongoConfigured: false,
      });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ success: true, essays: [], isMongoConfigured: false });
    }

    const essays = await db
      .collection("essays")
      .find({ username })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      success: true,
      essays,
      isMongoConfigured: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username = "default", language = "Angol", title, text, feedback } = body;

    const essayDoc = {
      username,
      language,
      title: title || "Fogalmazás",
      text,
      feedback,
      createdAt: new Date().toISOString(),
    };

    if (isMongoConfigured()) {
      const db = await getDb();
      if (db) {
        await db.collection("essays").insertOne(essayDoc);
      }
    }

    return NextResponse.json({
      success: true,
      essay: essayDoc,
      isMongoConfigured: isMongoConfigured(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
