import { NextRequest, NextResponse } from "next/server";
import { getDb, isMongoConfigured } from "@/lib/mongodb";
import { INITIAL_COURSES } from "@/lib/store";

export async function GET() {
  try {
    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        source: "default_seed",
        courses: INITIAL_COURSES,
        isMongoConfigured: false,
      });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        source: "fallback",
        courses: INITIAL_COURSES,
        isMongoConfigured: false,
      });
    }

    const coursesCollection = db.collection("courses");
    const courses = await coursesCollection.find({}).toArray();

    if (!courses || courses.length === 0) {
      // Seed default courses into MongoDB
      await coursesCollection.insertMany(INITIAL_COURSES as any);
      return NextResponse.json({
        success: true,
        source: "mongodb_seeded",
        courses: INITIAL_COURSES,
        isMongoConfigured: true,
      });
    }

    return NextResponse.json({
      success: true,
      source: "mongodb",
      courses,
      isMongoConfigured: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "MongoDB Error",
      courses: INITIAL_COURSES,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { courses } = await req.json();
    if (!Array.isArray(courses)) {
      return NextResponse.json({ error: "Invalid courses format" }, { status: 400 });
    }

    if (!isMongoConfigured()) {
      return NextResponse.json({
        success: true,
        message: "Saved locally (MongoDB not configured - set 'mogo' in .env.local)",
        isMongoConfigured: false,
      });
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    const coursesCollection = db.collection("courses");
    await coursesCollection.deleteMany({});
    await coursesCollection.insertMany(courses as any);

    return NextResponse.json({
      success: true,
      message: "Courses successfully saved to MongoDB!",
      isMongoConfigured: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
