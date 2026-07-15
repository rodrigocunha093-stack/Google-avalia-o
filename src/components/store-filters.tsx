"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function StoreFilters({
  bairros,
  ratingPeriod,
  statuses,
  stores,
  themes,
}: {
  bairros: string[];
  ratingPeriod: string;
  statuses: string[];
  stores: { id: string; name: string }[];
  themes: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="space-y-4">
      <Select label="Unidade" name="store" onChange={update} value={searchParams.get("store") ?? ""}>
        <option value="">Todas</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>{store.name}</option>
        ))}
      </Select>
      <Select label="Nota minima" name="rating" onChange={update} value={searchParams.get("rating") ?? ""}>
        <option value="">Qualquer nota</option>
        <option value="4.8">4.8+</option>
        <option value="4.6">4.6+</option>
        <option value="4.4">4.4+</option>
      </Select>
      <Select label="Bairro" name="bairro" onChange={update} value={searchParams.get("bairro") ?? ""}>
        <option value="">Todos</option>
        {bairros.map((bairro) => (
          <option key={bairro} value={bairro}>{bairro}</option>
        ))}
      </Select>
      <Select label="Status" name="status" onChange={update} value={searchParams.get("status") ?? ""}>
        <option value="">Todos</option>
        {statuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </Select>
      <Select label="Periodo" name="period" onChange={update} value={searchParams.get("period") ?? ""}>
        <option value="">Historico publico disponivel</option>
        <option value="ultima-semana">Ultima semana</option>
      </Select>
      <Select label="Grafico de nota" name="ratingPeriod" onChange={update} value={searchParams.get("ratingPeriod") ?? ratingPeriod}>
        <option value="semanal">Semanal</option>
        <option value="mensal">Mensal</option>
        <option value="anual">Anual</option>
      </Select>
      <Select label="Tema" name="theme" onChange={update} value={searchParams.get("theme") ?? ""}>
        <option value="">Todos os temas</option>
        {themes.map((theme) => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </Select>
    </div>
  );
}

function Select({
  children,
  label,
  name,
  onChange,
  value,
}: {
  children: React.ReactNode;
  label: string;
  name: string;
  onChange: (key: string, value: string) => void;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        className="mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        onChange={(event) => onChange(name, event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}
