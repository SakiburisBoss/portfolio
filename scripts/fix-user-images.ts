// scripts/fix-user-images.ts
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
if (!CLERK_API_KEY) {
  throw new Error("CLERK_SECRET_KEY is not set in environment variables");
}

async function fixUserImages() {
  const users = await prisma.user.findMany({
    where: { clerkUserId: { not: undefined} },
    select: { id: true, clerkUserId: true, name: true, imageUrl: true }
  });

  console.log(`Found ${users.length} users to process`);

  const BATCH_SIZE = 10;
  let updatedCount = 0;

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    const clerkUserIds = batch.map(user => user.clerkUserId!).filter(Boolean);
    
    if (clerkUserIds.length === 0) continue;

    try {
      const response = await (await clerkClient()).users.getUserList({
        userId: clerkUserIds,
        limit: BATCH_SIZE
      });

      for (const clerkUser of response.data) {
        const dbUser = batch.find(u => u.clerkUserId === clerkUser.id);
        if (!dbUser) continue;

        // Clerk already provides the best available image here
        const newImageUrl = clerkUser.imageUrl;
        
        // Skip if same or no image
        if (!newImageUrl || dbUser.imageUrl === newImageUrl) continue;

        await prisma.user.update({
          where: { id: dbUser.id },
          data: { imageUrl: newImageUrl }
        });

        updatedCount++;
        console.log(`Updated ${dbUser.name} (${dbUser.id}): ${newImageUrl}`);
      }
    } catch (error) {
      console.error(`Error processing batch ${i / BATCH_SIZE}:`, error);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\nUpdate complete! ${updatedCount} users updated`);
}

// Add dry-run support
const DRY_RUN = process.argv.includes("--dry-run");

if (DRY_RUN) {
  console.log("Running in DRY-RUN mode. No changes will be made to the database.");
  // Modify update to be read-only in dry-run
  let fixUserImages = async () => {
    const users = await prisma.user.findMany({
      where: { clerkUserId: { not: undefined } },
      select: { id: true, clerkUserId: true, name: true, imageUrl: true }
    });

    console.log(`Found ${users.length} users to process`);
    
    for (const user of users) {
      try {
        const clerkUser = await (await clerkClient()).users.getUser(user.clerkUserId!);
        if (clerkUser.imageUrl && user.imageUrl !== clerkUser.imageUrl) {
          console.log(`Would update ${user.name}: ${clerkUser.imageUrl}`);
        }
      } catch (error) {
        console.error(`Error checking ${user.id}:`, error);
      }
    }
  };
}

fixUserImages()
  .then(() => console.log("Operation complete!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());