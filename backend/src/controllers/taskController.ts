import type { Request, Response } from "express";
import { prisma } from "../lib/client.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskParamsSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
  type TaskParams,
} from "../schemas/taskSchemas.js";

// GET /tasks - Alle Aufgaben abrufen
export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fehler beim Abrufen der Aufgaben:", error);
    res.status(500).json({
      error: "Serverfehler",
      message: "Die Aufgaben konnten nicht geladen werden",
    });
  }
};

// POST /tasks - Neue Aufgabe erstellen
export const createTask = async (req: Request, res: Response) => {
  try {
    // Zod Validation: Überprüft automatisch alle Felder nach unserem Schema
    // Falls Validation fehlschlägt, wird ein ZodError geworfen
    const validatedData: CreateTaskInput = createTaskSchema.parse(req.body);

    // Erstelle neue Aufgabe mit validierten Daten
    const task = await prisma.task.create({
      data: {
        title: validatedData.title, // Bereits getrimmt durch Zod
        description: validatedData.description ?? null,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    // Zod Validation Fehler abfangen und benutzerfreundlich zurückgeben
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({
        error: "Eingabedaten ungültig",
        message: "Die übermittelten Daten entsprechen nicht den Anforderungen",
        details: JSON.parse(error.message),
      });
    }

    console.error("Fehler beim Erstellen der Aufgabe:", error);
    res.status(500).json({
      error: "Serverfehler",
      message: "Die Aufgabe konnte nicht erstellt werden",
    });
  }
};

// PUT /tasks/:id - Aufgabe aktualisieren
export const updateTask = async (req: Request, res: Response) => {
  try {
    // Validiere URL Parameter (die Task ID)
    const { id: taskId }: TaskParams = taskParamsSchema.parse(req.params);

    // Validiere Request Body mit Zod Schema
    const validatedData: UpdateTaskInput = updateTaskSchema.parse(req.body);

    // Prüfe ob Aufgabe existiert
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: "Aufgabe nicht gefunden",
        message: `Aufgabe mit ID ${taskId} existiert nicht`,
      });
    }

    // Update mit validierten Daten
    // Verwende existierende Werte als Fallback wenn neue Werte nicht angegeben sind
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: validatedData.title,
        description: validatedData.description ?? existingTask.description,
        dueDate: validatedData.dueDate
          ? new Date(validatedData.dueDate)
          : existingTask.dueDate,
        isDone: validatedData.isDone ?? existingTask.isDone,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    // Zod Validation Fehler behandeln
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({
        error: "Eingabedaten ungültig",
        message: "Die Aktualisierungsdaten entsprechen nicht den Anforderungen",
        details: JSON.parse(error.message),
      });
    }

    console.error("Fehler beim Aktualisieren der Aufgabe:", error);
    res.status(500).json({
      error: "Serverfehler",
      message: "Die Aufgabe konnte nicht aktualisiert werden",
    });
  }
};

// DELETE /tasks/:id - Aufgabe löschen
export const deleteTask = async (req: Request, res: Response) => {
  try {
    // Validiere URL Parameter mit Zod
    // Automatische Konvertierung von String zu Number durch transform()
    const { id: taskId }: TaskParams = taskParamsSchema.parse(req.params);

    // Prüfe ob Aufgabe existiert bevor wir sie löschen
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: "Aufgabe nicht gefunden",
        message: `Aufgabe mit ID ${taskId} kann nicht gelöscht werden, da sie nicht existiert`,
      });
    }

    // Lösche die Aufgabe
    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    // Zod Validation Fehler für ungültige IDs
    if (error instanceof Error && error.name === "ZodError") {
      return res.status(400).json({
        error: "Ungültige Aufgaben-ID",
        message: "Die angegebene ID ist nicht gültig",
        details: JSON.parse(error.message),
      });
    }

    console.error("Fehler beim Löschen der Aufgabe:", error);
    res.status(500).json({
      error: "Serverfehler",
      message: "Die Aufgabe konnte nicht gelöscht werden",
    });
  }
};
