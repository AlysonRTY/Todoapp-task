import { useState } from "react";
import type { Task } from "../hooks/useTasks";

// Props Interface für TaskCard Komponente
// Definiert alle Callbacks und Daten die von der Parent-Komponente übergeben werden
interface TaskCardProps {
  task: Task; // Die anzuzeigende Task
  isEditing: boolean; // Ob sich die Karte im Bearbeitungsmodus befindet
  onEdit: () => void; // Callback zum Aktivieren des Bearbeitungsmodus
  onSave: (updates: Partial<Task>) => void; // Callback zum Speichern von Änderungen
  onCancel: () => void; // Callback zum Abbrechen der Bearbeitung
  onToggle: () => void; // Callback zum Umschalten des Task-Status (erledigt/nicht erledigt)
  onDelete: () => void; // Callback zum Löschen der Task
  formatDate: (date: string) => string; // Hilfsfunktion zur Datumsformatierung
}

/**
 * TaskCard Komponente - Zeigt eine einzelne Task in Karten-Layout an
 */

export function TaskCard({
  task,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onToggle,
  onDelete,
  formatDate,
}: TaskCardProps) {
  // Lokaler State für Bearbeitungsdaten
  // Wird nur im Bearbeitungsmodus verwendet und bei Änderungen aktualisiert
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || "",
    // Datum für datetime-local Input formatieren
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().slice(0, 16)
      : "",
  });

  //  Validiert Eingaben und ruft Parent-Callback auf
  const handleSave = () => {
    // Frontend-Validation: Titel ist Pflichtfeld
    if (!editData.title.trim()) return;

    onSave({
      title: editData.title.trim(),
      // Leere Strings zu undefined konvertieren für Backend-Kompatibilität
      description: editData.description.trim() || undefined,
      dueDate: editData.dueDate.trim() || undefined,
    });
  };

  // Berechne ob Task überfällig ist (nur für nicht erledigte Tasks)
  const isOverdue =
    task.dueDate && !task.isDone && new Date(task.dueDate) < new Date();

  return (
    <div
      className={`relative rounded-2xl p-5 ${
        task.isDone
          ? "bg-linear-to-br from-green-50 to-emerald-50/30 border border-green-200/50"
          : "bg-white border border-orange-200/80"
      } ${isOverdue ? "border-l-4 border-l-red-400" : ""}`}
    >
      {isEditing ? (
        // BEARBEITUNGSMODUS: Inline-Formular für Task-Änderungen
        // Design: Notizblock-ähnliches Aussehen mit gelben Hintergründen
        <div className="space-y-4">
          {/* Titel-Input */}
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="w-full px-4 py-2 bg-yellow-50/50 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 font-medium placeholder-gray-500 transition-all duration-200"
            placeholder="Aufgabentitel..."
          />

          {/* Beschreibung:*/}
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            placeholder="Beschreibung..."
            className="w-full px-4 py-2 bg-yellow-50/50 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 resize-none placeholder-gray-500 transition-all duration-200"
            rows={2}
          />

          {/* Mobile-optimiertes Layout für Datum und Buttons */}
          <div className="space-y-3">
            {/* Fälligkeitsdatum: HTML5 datetime-local für bessere UX */}
            <input
              type="datetime-local"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
              className="w-full px-3 py-2 bg-yellow-50/50 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 text-sm transition-all duration-200"
            />

            {/* Action Buttons: Mobile-optimiert mit Icons und Text */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>Speichern</span>
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-400 text-white py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors text-sm font-medium shadow-sm flex items-center justify-center gap-2"
              >
                <span>✕</span>
                <span>Abbrechen</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ANZEIGEMODUS
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Status-Toggle */}
              <button
                onClick={onToggle}
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                  task.isDone
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                }`}
              >
                {task.isDone && "✓"}
              </button>

              {/*Titel und optionale Beschreibung */}
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-medium leading-relaxed wrap-break-word ${
                    task.isDone ? "line-through text-gray-500" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>

                {/* Beschreibung (wird nur angezeigt  wenn vorhanden) */}
                {task.description && (
                  <p className="text-gray-600 text-sm mt-2 leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center text-sm"
                title="Bearbeiten"
              >
                ✎
              </button>
              <button
                onClick={onDelete}
                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-sm"
                title="Löschen"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Metadaten-Bereich*/}
          <div className="pt-3 border-t border-gray-100/80 space-y-2">
            {/* Fälligkeitsdatum und Status-Badge */}
            <div className="flex items-center justify-between">
              {task.dueDate ? (
                <div
                  className={`flex items-center gap-2 text-sm ${
                    isOverdue ? "text-red-500 font-medium" : "text-gray-600"
                  }`}
                >
                  <span>📅</span>
                  <span>Fällig: {formatDate(task.dueDate)}</span>
                  {/* Überfällig-Badge (Nur bei überfälligen Tasks angezeigt) */}
                  {isOverdue && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                      Überfällig
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  <span>📅</span>
                  <span className="ml-2">Kein Fälligkeitsdatum</span>
                </div>
              )}

              {/* Status-Badge*/}
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.isDone
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {task.isDone ? "Erledigt 🎉" : "In Bearbeitung"}
              </div>
            </div>

            {/* Timestamps (Erstellungs- und Änderungsdatum) */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Erstellt: {formatDate(task.createdAt)}</span>
              <span>•</span>
              <span>Zuletzt bearbeitet: {formatDate(task.updatedAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
