"use client";

import { useState } from "react";
import { saveAdminSettings } from "@/src/app-actions/settings";
import type { AdminSettings, BusinessHour } from "@/src/types/settings";

const labels: Record<BusinessHour["day_of_week"], string> = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Quinta-feira",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
};

export function AdminSettingsForm({ settings }: { settings: AdminSettings }) {
  const [ownerName, setOwnerName] = useState(settings.owner_name);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [hours, setHours] = useState(settings.business_hours);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  function updateHour(index: number, changes: Partial<BusinessHour>) {
    setHours((current) => current.map((hour, hourIndex) => hourIndex === index ? { ...hour, ...changes } : hour));
    setFeedback(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    const formData = new FormData(event.currentTarget);
    formData.set("hours", JSON.stringify(hours.map((hour) => ({
      dayOfWeek: hour.day_of_week,
      isOpen: hour.is_open,
      openingTime: hour.is_open ? hour.opening_time : null,
      closingTime: hour.is_open ? hour.closing_time : null,
    }))));
    const result = await saveAdminSettings(formData);
    setSaving(false);
    setFeedback(result.ok
      ? { type: "success", text: "Configurações salvas com sucesso." }
      : { type: "error", text: result.error });
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-stone-200 sm:p-8">
      <div>
        <h2 className="font-bold text-stone-900">Identificação da proprietária</h2>
        <label className="mt-4 block text-sm font-semibold text-stone-700">
          Nome
          <input name="ownerName" value={ownerName} onChange={(event) => { setOwnerName(event.target.value); setFeedback(null); }} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500" placeholder="Nome da proprietária" />
        </label>
        <p className="mt-2 text-xs text-stone-500">Esse nome poderá ser usado em saudações da área administrativa.</p>
      </div>

      <div className="border-t border-stone-200 pt-6">
        <h2 className="font-bold text-stone-900">Horários de funcionamento</h2>
        <p className="mt-1 text-sm text-stone-500">Selecione os dias abertos e informe um intervalo para cada dia.</p>
        <div className="mt-4 grid gap-3">
          {hours.map((hour, index) => (
            <div className="rounded-xl bg-stone-50 p-4" key={hour.day_of_week}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                  <input checked={hour.is_open} onChange={(event) => updateHour(index, { is_open: event.target.checked, opening_time: event.target.checked ? (hour.opening_time ?? "11:00") : null, closing_time: event.target.checked ? (hour.closing_time ?? "14:00") : null })} type="checkbox" className="size-4 accent-orange-600" />
                  {labels[hour.day_of_week]}
                </label>
                <span className={`text-xs font-bold uppercase tracking-wide ${hour.is_open ? "text-emerald-700" : "text-stone-400"}`}>{hour.is_open ? "Aberto" : "Fechado"}</span>
              </div>
              {hour.is_open && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-sm">
                  <label className="text-xs font-semibold text-stone-500">Abertura<input type="time" value={hour.opening_time ?? ""} onChange={(event) => updateHour(index, { opening_time: event.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700" /></label>
                  <label className="text-xs font-semibold text-stone-500">Encerramento<input type="time" value={hour.closing_time ?? ""} onChange={(event) => updateHour(index, { closing_time: event.target.value })} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700" /></label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-200 pt-6">
        <h2 className="font-bold text-stone-900">WhatsApp dos pedidos</h2>
        <input name="whatsapp" value={whatsapp} onChange={(event) => { setWhatsapp(event.target.value); setFeedback(null); }} placeholder="(85) 99999-0000" className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500" />
        <p className="mt-2 text-xs text-stone-500">Informe um número brasileiro com DDD.</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button disabled={saving} className="rounded-xl bg-orange-600 px-5 py-4 font-bold text-white disabled:cursor-wait disabled:opacity-60">{saving ? "Salvando..." : "Salvar configurações"}</button>
        {feedback && <span role={feedback.type === "error" ? "alert" : "status"} className={`text-sm font-semibold ${feedback.type === "error" ? "text-red-700" : "text-emerald-700"}`}>{feedback.text}</span>}
      </div>
    </form>
  );
}
