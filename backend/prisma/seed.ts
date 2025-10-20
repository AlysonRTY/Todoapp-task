import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample tasks...");

  const tasks = [
    {
      title: "Git Workflow",
      description: "Mit Feature-Branches arbeiten statt direkt auf main",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      isDone: false,
    },
    {
      title: "Zod Middleware",
      description: "Zentrale Validierung im Backend für alle Routes",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      isDone: false,
    },
    {
      title: "Component Refactoring",
      description: "Kleinere, wiederverwendbare React-Komponenten",
      isDone: false,
    },
    {
      title: "Testing",
      description: "Unit Tests und End-to-End Tests hinzufügen",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      isDone: false,
    },
    {
      title: "React Optimierung",
      description:
        "Memoization mit `useMemo` und `useCallback` für bessere Performance",
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
