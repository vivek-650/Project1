import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";

const DEFAULT_PASSWORD = "Coordinator@123";

const coordinators = Array.from({ length: 3 }, (_, index) => {
  const serial = String(index + 1).padStart(2, "0");
  return {
    id: `coordinator-${serial}`,
    name: `Coordinator ${serial}`,
    email: `coordinator${serial}@college.edu`,
    contactNo: `70000000${serial}`,
    role: "coordinator",
    isActive: true,
  };
});

async function seedCoordinators() {
  const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const batch = db.batch();

  coordinators.forEach((coordinator) => {
    const docRef = db.collection("coordinators").doc(coordinator.email.toLowerCase());
    batch.set(
      docRef,
      {
        ...coordinator,
        email: coordinator.email.toLowerCase(),
        password,
        createdAt: new Date(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  console.log("Seed complete: inserted/updated 3 coordinators in collection 'coordinators'.");
  console.log("Default login password for all seeded coordinators:", DEFAULT_PASSWORD);
}

seedCoordinators()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed coordinators:", error.message);
    process.exit(1);
  });
