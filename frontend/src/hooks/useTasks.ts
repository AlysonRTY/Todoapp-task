import { useState, useEffect } from "react";

// Task Interface (Entspricht dem Prisma Model aus dem Backend)
interface Task {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Base URL aus Umgebungsvariablen mit Fallback für lokale dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Custom Hook für Task-Management
 * Stellt alle CRUD-Operationen für Tasks zur Verfügung
 * Verwaltet lokalen State und synchronisiert mit Backend API
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // GET /tasks - Alle Aufgaben vom Backend laden
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Fehler beim Laden der Aufgaben:", error);
    } finally {
      setLoading(false);
    }
  };

  // POST /tasks (Neue Aufgabe erstellen)
  const createTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    // Frontend-Validation
    if (!taskData.title.trim()) return false;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskData.title,
          // Leere Strings zu undefined konvertieren für Backend-Validation
          description: taskData.description.trim() || undefined,
          dueDate: taskData.dueDate.trim() || undefined,
        }),
      });

      if (response.ok) {
        // Nach erfolgreichem Erstellen Tasks neu laden
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fehler beim Erstellen der Aufgabe:", error);
      return false;
    }
  };

  // PUT /tasks/:id (Aufgabe aktualisieren)
  const updateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      // Prüfe ob Task im lokalen State existiert
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return false;

      // Nur die tatsächlich geänderten Felder senden (Partial Update)
      // Verhindert unnötige Datenübertragung und Backend-Verarbeitung
      const updateData: any = {};

      if (updates.title !== undefined) {
        updateData.title = updates.title;
      }
      if (updates.description !== undefined) {
        // Leere Strings zu undefined konvertieren für Backend-Validation
        updateData.description = updates.description || undefined;
      }
      if (updates.dueDate !== undefined) {
        updateData.dueDate = updates.dueDate || undefined;
      }
      if (updates.isDone !== undefined) {
        updateData.isDone = updates.isDone;
      }

      console.log("Sending update data:", updateData);

      const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Nach erfolgreichem Update Tasks neu laden
        await fetchTasks();
        return true;
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
      }
      return false;
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", error);
      return false;
    }
  };

  // DELETE /tasks/:id (Aufgabe löschen)
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Nach erfolgreichem Löschen Tasks neu laden
        await fetchTasks();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Fehler beim Löschen der Aufgabe:", error);
      return false;
    }
  };

  // Hilfsfunktion (Task Status umschalten, erledigt/nicht erledigt)
  const toggleTask = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return false;

    // Nutze updateTask mit invertiertem isDone Status
    return await updateTask(taskId, { isDone: !task.isDone });
  };

  // Beim ersten Laden des Hooks alle Tasks abrufen
  useEffect(() => {
    fetchTasks();
  }, []);

  // Hook API: Alle verfügbaren Funktionen und State zurückgeben
  return {
    tasks, // Aktuelle Task-Liste
    loading, // Loading-Status für UI-Feedback
    createTask, // Neue Task erstellen
    updateTask, // Bestehende Task aktualisieren
    deleteTask, // Task löschen
    toggleTask, // Task Status umschalten (Convenience-Funktion)
    refetch: fetchTasks, // Manuelles Neuladen der Tasks
  };
};

export type { Task };
