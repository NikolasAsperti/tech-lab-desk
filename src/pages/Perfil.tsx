import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, Save } from "lucide-react";

export default function Perfil() {
  const { user, updateProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [nome] = useState(user?.nome || "");
  const [email] = useState(user?.email || "");
  const [lab, setLab] = useState(user?.sala || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ sala: lab || undefined, telefone: telefone || undefined });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const papelLabel =
    user?.papel === "admin"
      ? "Administrador"
      : user?.papel === "tecnico"
        ? "Técnico"
        : user?.subtipo === "professor"
          ? "Professor"
          : user?.subtipo === "aluno"
            ? "Aluno"
            : "Usuário";

  const papelBadgeClass =
    user?.papel === "admin"
      ? "bg-primary/15 text-primary"
      : user?.papel === "tecnico"
        ? "bg-status-progress-bg text-status-progress-foreground"
        : "bg-muted text-muted-foreground";

  const initials = nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-xl animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Editar Perfil</h1>

      <div className="rounded-xl border bg-card p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold overflow-hidden group"
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
          <button onClick={() => fileRef.current?.click()} className="text-sm text-primary hover:underline">
            Alterar foto
          </button>
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${papelBadgeClass}`}>
            {papelLabel}
          </span>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <Field label="Nome completo" value={nome} disabled />
          <Field label="Email" value={email} disabled />
          <Field label="Laboratório associado (opcional)" value={lab} onChange={setLab} placeholder="Ex: Jobs" />
          <Field label="Telefone (opcional)" value={telefone} onChange={setTelefone} placeholder="(00) 00000-0000" />
        </div>

        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Save className="h-4 w-4" /> Salvar Alterações
        </button>

        {salvo && (
          <p className="text-center text-sm text-green-600 dark:text-green-400 animate-fade-in">
            Perfil atualizado com sucesso!
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, disabled, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-card-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring disabled:opacity-50 transition-shadow"
      />
    </div>
  );
}
