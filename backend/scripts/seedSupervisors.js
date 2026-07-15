import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";

const DEFAULT_PASSWORD = "Supervisor@123";

const supervisors = Array.from({ length: 10 }, (_, index) => {
  const serial = String(index + 1).padStart(2, "0");
  return {
    id: `supervisor-${serial}`,
    name: `Supervisor ${serial}`,
    email: `supervisor${serial}@college.edu`,
    contactNo: `90000000${serial}`,
    role: "supervisor",
    isActive: true,
  };
});
async function seedSupervisors() {
  const password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const batch = db.batch();

  supervisors.forEach((supervisor) => {
    const docRef = db.collection("supervisors").doc(supervisor.email.toLowerCase());
    batch.set(
      docRef,
      {
        ...supervisor,
        email: supervisor.email.toLowerCase(),
        password,
        createdAt: new Date(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  console.log("Seed complete: inserted/updated 10 supervisors in collection 'supervisors'.");
  console.log("Default login password for all seeded supervisors:", DEFAULT_PASSWORD);
}

seedSupervisors()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed supervisors:", error.message);
    process.exit(1);
  });
