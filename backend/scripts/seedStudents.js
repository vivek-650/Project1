import { db } from "../config/firebase.js";

const DEFAULT_PASSWORD = "Student@123";

const students = Array.from({ length: 10 }, (_, index) => {
  const serial = String(index + 1).padStart(2, "0");
  const roll = `2021CSE${serial}`;
  return {
    roll,
    name: `Student ${serial}`,
    email: `student${serial}@college.edu`,
    phone: `80000000${serial}`,
    role: "student",
    isActive: true,
    passwordChanged: true,
  };
});

async function seedStudents() {
  const batch = db.batch();

  students.forEach((student) => {
    const docRef = db.collection("students").doc(student.roll);
    batch.set(
      docRef,
      {
        ...student,
        email: student.email.toLowerCase(),
        password: DEFAULT_PASSWORD,
        createdAt: new Date(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  console.log("Seed complete: inserted/updated 10 students in collection 'students'.");
  console.log("Default login password for all seeded students:", DEFAULT_PASSWORD);
}

seedStudents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to seed students:", error.message);
    process.exit(1);
  });
