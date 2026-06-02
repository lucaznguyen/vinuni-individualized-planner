import { FileText } from "lucide-react";

interface SpeakerNotesProps {
  notes: string;
  time: string;
}

export default function SpeakerNotes({ notes, time }: SpeakerNotesProps) {
  return (
    <aside className="rounded-lg border border-vip-line bg-vip-panel p-4">
      <div className="flex items-center gap-2">
        <FileText className="text-vip-blue" size={18} aria-hidden="true" />
        <h3 className="text-sm font-semibold uppercase text-vip-blue">Presenter Notes</h3>
      </div>
      <p className="mt-3 text-sm font-semibold text-vip-ink">Estimated time: {time}</p>
      <p className="mt-2 text-sm leading-6 text-vip-muted">{notes}</p>
    </aside>
  );
}
