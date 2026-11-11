"use client";

import { useState } from "react";

const weekDays = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

type Schedule = {
  open: boolean;
  start: string;
  end: string;
};

const initialSchedules: Schedule[] = weekDays.map((_, index) => ({
  open: index < 5,
  start: "11:00",
  end: "14:00",
}));

export default function SettingsPrototypePage() {
  const [ownerName, setOwnerName] = useState("Maria");
  const [whatsapp, setWhatsapp] = useState("(85) 99999-0000");
  const [schedules, setSchedules] = useState(initialSchedules);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function updateSchedule(index: number, changes: Partial<Schedule>) {
    setSchedules((current) =>
      current.map((schedule, scheduleIndex) =>
        scheduleIndex === index ? { ...schedule, ...changes } : schedule,
      ),
    );
    setSaved(false);
    setError("");
  }

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
        Configuração
      </p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">
        Funcionamento e WhatsApp
      </h1>
      <p className="mt-2 text-stone-500">
        Defina quando os pedidos podem ser encaminhados e os dados de
        identificação da proprietária.
      </p>
      <div className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-stone-200 sm:p-8">
        <div>
          <h2 className="font-bold text-stone-900">
            Identificação da proprietária
          </h2>
          <label className="mt-4 block text-sm font-semibold text-stone-700">
            Nome
            <input
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
              value={ownerName}
              onChange={(event) => {
                setOwnerName(event.target.value);
                setSaved(false);
                setError("");
              }}
              placeholder="Nome da proprietária"
            />
          </label>
          <p className="mt-2 text-xs text-stone-500">
            Esse nome poderá ser usado em saudações da área administrativa.
          </p>
        </div>

        <div className="border-t border-stone-200 pt-6">
          <h2 className="font-bold text-stone-900">Horários de funcionamento</h2>
          <p className="mt-1 text-sm text-stone-500">
            Selecione os dias abertos e informe um intervalo para cada dia.
          </p>
          <div className="mt-4 grid gap-3">
            {weekDays.map((day, index) => {
              const schedule = schedules[index];

              return (
                <div
                  className="rounded-xl bg-stone-50 p-4"
                  key={day}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-700">
                      <input
                        checked={schedule.open}
                        onChange={(event) =>
                          updateSchedule(index, { open: event.target.checked })
                        }
                        type="checkbox"
                        className="size-4 accent-orange-600"
                      />
                      {day}
                    </label>
                    <span
                      className={`text-xs font-bold uppercase tracking-wide ${
                        schedule.open ? "text-emerald-700" : "text-stone-400"
                      }`}
                    >
                      {schedule.open ? "Aberto" : "Fechado"}
                    </span>
                  </div>
                  {schedule.open && (
                    <div className="mt-3 grid grid-cols-2 gap-3 sm:max-w-sm">
                      <label className="text-xs font-semibold text-stone-500">
                        Abertura
                        <input
                          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
                          type="time"
                          value={schedule.start}
                          onChange={(event) =>
                            updateSchedule(index, { start: event.target.value })
                          }
                        />
                      </label>
                      <label className="text-xs font-semibold text-stone-500">
                        Encerramento
                        <input
                          className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700"
                          type="time"
                          value={schedule.end}
                          onChange={(event) =>
                            updateSchedule(index, { end: event.target.value })
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6">
          <h2 className="font-bold text-stone-900">WhatsApp dos pedidos</h2>
          <input
            className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-orange-500"
            value={whatsapp}
            onChange={(event) => {
              setWhatsapp(event.target.value);
              setSaved(false);
              setError("");
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            className="rounded-xl bg-orange-600 px-5 py-4 font-bold text-white sm:w-auto"
            onClick={() => {
              if (!ownerName.trim()) {
                setError("Informe o nome da proprietária.");
                setSaved(false);
                return;
              }

              const invalidSchedule = schedules.some(
                (schedule) =>
                  schedule.open && schedule.start >= schedule.end,
              );

              if (invalidSchedule) {
                setError(
                  "Em cada dia aberto, o horário de abertura deve ser anterior ao encerramento.",
                );
                setSaved(false);
                return;
              }

              setError("");
              setSaved(true);
            }}
            type="button"
          >
            Salvar configurações
          </button>
          {error && (
            <span className="text-sm font-semibold text-red-700">{error}</span>
          )}
          {saved && (
            <span className="text-sm font-semibold text-emerald-700">
              Configurações salvas no protótipo.
            </span>
          )}
        </div>
      </div>
    </>
  );
}
