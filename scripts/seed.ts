import { resetDemoData } from "../lib/db/seed";
import { prisma } from "../lib/db/prisma";

resetDemoData()
  .then((result) => {
    console.log(`Seed complete: ${JSON.stringify(result)}`);
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
