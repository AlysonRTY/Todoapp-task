import { z } from "zod";

// Schema für das Erstellen einer neuen Aufgabe
// Definiert welche Daten beim POST /tasks erwartet werden
export const createTaskSchema = z.object({
  // title: Pflichtfeld, muss ein String sein und darf nicht leer sein
  title: z
    .string({ message: "Aufgabentitel ist erforderlich" })
    .min(1, "Der Titel darf nicht leer sein")
    .max(200, "Der Titel darf maximal 200 Zeichen lang sein")
    .trim(),

  // description: Optional, kann ein String oder undefined sein
  description: z
    .string()
    .max(1000, "Die Beschreibung darf maximal 1000 Zeichen lang sein")
    .optional(),

  // dueDate: Optional, muss ein gültiges Datum sein wenn angegeben
  // Akzeptiert verschiedene Datumsformate inkl. datetime-local Format
  dueDate: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // Leere Strings sind erlaubt
      const dateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?)?$/;
      return dateRegex.test(val) && !isNaN(Date.parse(val));
    }, "Ungültiges Datumsformat")
    .transform((val) => (val && val.trim() !== "" ? val : undefined))
    .optional(),
});

// Schema für das Aktualisieren einer Aufgabe
// Alle Felder sind optional da nur geänderte Felder gesendet werden
export const updateTaskSchema = z.object({
  title: z
    .string({ message: "Aufgabentitel ist erforderlich" })
    .min(1, "Der Titel darf nicht leer sein")
    .max(200, "Der Titel darf maximal 200 Zeichen lang sein")
    .trim()
    .optional(),

  description: z
    .string()
    .max(1000, "Die Beschreibung darf maximal 1000 Zeichen lang sein")
    .optional(),

  // Akzeptiert verschiedene Datumsformate inkl. datetime-local Format
  dueDate: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true; // wie beim create, leere Strings sind erlaubt

      const dateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?Z?)?$/;
      return dateRegex.test(val) && !isNaN(Date.parse(val));
    }, "Ungültiges Datumsformat")
    .transform((val) => (val && val.trim() !== "" ? val : undefined))
    .optional(),

  // isDone: Boolean um den Status der Aufgabe zu ändern
  isDone: z.boolean({ message: "Status muss true oder false sein" }).optional(),
});

// Schema für URL Parameter (z.B. /tasks/:id)
// Validiert dass die ID eine positive Zahl ist
export const taskParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Aufgaben-ID muss eine gültige Zahl sein")
    .transform(Number),
});

// TypeScript Typen aus den Schemas ableiten
// Diese können wir in unserem Controller verwenden für bessere Type Safety
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskParams = z.infer<typeof taskParamsSchema>;
