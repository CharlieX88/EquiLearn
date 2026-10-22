import { connectDB } from "../config/db.js";
import Lesson from "../models/Lesson.js";
import { allLessons } from "./lessonsIndex.js";

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding lessons...");

    await Lesson.deleteMany({});
    console.log("🗑️  Cleared existing lessons");

    const created = await Lesson.insertMany(allLessons);
    console.log(`✅ Inserted ${created.length} lessons\n`);

    const byModule = created.reduce((acc, l) => {
      if (!acc[l.module]) acc[l.module] = [];
      acc[l.module].push(l);
      return acc;
    }, {});

    Object.entries(byModule).forEach(([mod, lsns]) => {
      console.log(`📚 ${mod} (${lsns.length} lessons):`);
      lsns.forEach((l) => console.log(`   • ${l.title}`));
    });

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed error: ${error.message}`);
    process.exit(1);
  }
};

seed();