import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample tasks...");

  const tasks = [
    {
      title: "Erste Aufgabe",
      description: "Das ist eine Beispielaufgabe",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      isDone: false,
    },
    {
      title: "Zweite Aufgabe",
      description: "Noch eine Aufgabe zum Testen",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      isDone: true,
    },
    {
      title: "Dritte Aufgabe",
      description: "Und eine dritte Aufgabe",
      isDone: false,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
