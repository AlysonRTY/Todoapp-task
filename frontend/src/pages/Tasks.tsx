import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { TaskCard } from "../components/TaskCard";

/**
 * Tasks Page - Hauptseite der Task-Management Anwendung
 */
function Tasks() {
  // Custom Hook für alle Task-Operationen und State-Management
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTask } =
    useTasks();

  // Lokaler State für Bearbeitungsmodus (welche Task wird gerade bearbeitet)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Formular-State für neue Task-Erstellung
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Form Submit Handler: Erstellt neue Task und resettet Formular bei Erfolg
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createTask(newTask);
    if (success) {
      // Formular zurücksetzen nach erfolgreichem Erstellen
      setNewTask({ title: "", description: "", dueDate: "" });
    }
  };

  // Hilfsfunktion: Formatiert ISO-Datum zu deutschem Locale-Format
  // Wird an TaskCard weitergegeben für konsistente Datumsdarstellung
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      // Fallback für ungültige Datumsstrings
      return "Ungültiges Datum";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-orange-200">
            <h1 className="text-2xl font-serif font-bold text-gray-800">
              Aufgaben
            </h1>
          </div>
        </div>

        {/* Task-Erstellungsformular */}
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6 mb-8 relative hover:shadow-md transition-shadow duration-300"
        >
          {/* Dekorative Elemente */}
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-100 rounded-full"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-amber-100 rounded-full"></div>

          <div className="space-y-4">
            {/* Titel-Input */}
            <div>
              <input
                type="text"
                placeholder="Was möchtest du erledigen?"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-amber-50/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 placeholder-gray-500 text-gray-800 font-medium transition-all duration-200"
                required
              />
            </div>

            {/* Beschreibung, Datum und Submit-Button */}
            <div className="flex gap-3">
              {/* Beschreibung */}
              <textarea
                placeholder="Notizen... (optional)"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="flex-1 px-4 py-3 bg-amber-50/50 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-orange-300 placeholder-gray-500 text-gray-700 resize-none transition-all duration-200"
                rows={2}
              />

              <div className="flex flex-col gap-3 min-w-[140px]">
                {/* Fälligkeitsdatum */}
                <input
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-amber-50/50 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 text-sm transition-all duration-200"
                />

                {/* Submit-Button */}
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-orange-400 to-red-400 text-white py-2 px-4 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-1"
                >
                  <span>+</span>
                  <span>Hinzufügen</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Task-Liste */}
        <div className="mb-6">
          {/* Listen-Header */}
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              Alle Aufgaben{" "}
              <span className="text-orange-500">({tasks.length})</span>
            </h2>
          </div>

          {/* Conditional Rendering: Loading, Empty State oder Task-Liste */}
          {loading ? (
            // Loading State: Animierte Skeleton-UI während API-Aufruf
            <div className="text-center py-12 space-y-3">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-orange-200 rounded-full"></div>
                <div className="h-4 bg-orange-200 rounded w-32"></div>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            // Empty State: Nachricht wenn keine Tasks vorhanden
            <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-orange-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-gray-600 mb-2">Noch keine Aufgaben</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Füge deine erste Aufgabe hinzu und beginne deinen produktiven
                Tag!
              </p>
            </div>
          ) : (
            // Task-Liste: Rendert TaskCard für jede Task mit Event-Handlers
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isEditing={editingId === task.id}
                  onEdit={() => setEditingId(task.id)}
                  onSave={(updates) => {
                    // Nach dem Speichern Bearbeitungsmodus beenden
                    updateTask(task.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;
