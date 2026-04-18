"use client";

import { useState, useMemo } from "react";

/**
 * APAP (acetaminophen) metabolic pathway simulator.
 *
 * Flux math (all rates in grams per dose-equivalent):
 *   glucuronidation saturates around Vmax_UGT g
 *   sulfation saturates around Vmax_SULT g
 *   a small baseline fraction always goes through CYP2E1
 *   any overflow above saturation is forced into CYP2E1 too
 *   CYP2E1 output becomes NAPQI 1:1
 *   GSH neutralizes NAPQI 1:1 up to its effective capacity
 *   NAPQI beyond GSH capacity causes hepatocyte damage
 */
const VMAX_UGT = 2.4;       // glucuronidation ceiling (g/dose)
const VMAX_SULT = 1.0;      // sulfation ceiling (g/dose)
const CYP_BASELINE = 0.05;  // 5% always leaks to CYP450 even at low dose
const GSH_CAPACITY = 3.0;   // grams of NAPQI that full GSH can neutralize
const NAC_MULTIPLIER = 1.5; // NAC rescue boosts effective GSH

interface Flux {
  glucuronidation: number;
  sulfation: number;
  cyp450: number;
  napqi: number;
  gshRescue: number;
  necrosis: number;
  safeTotal: number;
}

function computeFlux(dose: number, gshPct: number, nac: boolean): Flux {
  const glucuronidation = Math.min(dose * 0.6, VMAX_UGT);
  const sulfation = Math.min(dose * 0.3, VMAX_SULT);
  const baselineCyp = dose * CYP_BASELINE;
  const overflow = Math.max(0, dose - glucuronidation - sulfation - baselineCyp);
  const cyp450 = baselineCyp + overflow;
  const napqi = cyp450;
  const gshEffective = (gshPct / 100) * GSH_CAPACITY * (nac ? NAC_MULTIPLIER : 1);
  const gshRescue = Math.min(napqi, gshEffective);
  const necrosis = Math.max(0, napqi - gshRescue);
  return {
    glucuronidation,
    sulfation,
    cyp450,
    napqi,
    gshRescue,
    necrosis,
    safeTotal: glucuronidation + sulfation + gshRescue,
  };
}

type Status = "stable" | "stressed" | "toxic";

function computeStatus(flux: Flux): Status {
  if (flux.necrosis > 0.1) return "toxic";
  if (flux.cyp450 > 0.5) return "stressed";
  return "stable";
}

// Particle count reflects flux rate. Capped so the SVG stays legible.
function particleCount(rate: number, max = 8): number {
  if (rate <= 0) return 0;
  const scaled = Math.round(rate * 2);
  return Math.max(1, Math.min(max, scaled));
}

// Animation duration inversely related to rate — higher rate = faster particles
function particleDuration(rate: number): number {
  if (rate <= 0) return 10;
  return Math.max(1.2, 4 - rate * 0.4);
}

interface ParticlesProps {
  pathId: string;
  count: number;
  duration: number;
  color: string;
  radius?: number;
}

function Particles({ pathId, count, duration, color, radius = 3 }: ParticlesProps) {
  if (count <= 0) return null;
  const stagger = duration / count;
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <circle key={`${pathId}-${i}`} r={radius} fill={color} opacity={0.85}>
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${i * stagger}s`}
            rotate="auto"
          >
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      ))}
    </>
  );
}

export default function APAPSimulator() {
  const [dose, setDose] = useState(1);
  const [gsh, setGsh] = useState(100);
  const [nac, setNac] = useState(false);

  const flux = useMemo(() => computeFlux(dose, gsh, nac), [dose, gsh, nac]);
  const status = computeStatus(flux);

  const statusLabel =
    status === "toxic"
      ? "Acute Hepatotoxicity"
      : status === "stressed"
        ? "Saturated · Buffer Engaged"
        : "Stable · Safe Clearance";

  const statusColor =
    status === "toxic"
      ? "text-red-400 border-red-500/40 bg-red-500/10"
      : status === "stressed"
        ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
        : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";

  const doseLabel =
    dose <= 4 ? "Therapeutic" : dose <= 7 ? "Risk Zone" : "Overdose";

  return (
    <div className="my-10 rounded-2xl border border-surface-light bg-surface p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">
            Interactive Simulator
          </p>
          <h3 className="text-xl md:text-2xl font-bold">
            Acetaminophen Metabolic Pathway
          </h3>
          <p className="text-sm text-muted mt-1">
            Drag the sliders to see how dose and glutathione levels drive the flux
            through each pathway.
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-widest ${statusColor}`}
        >
          {statusLabel}
        </div>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-semibold text-foreground">Dose</label>
            <span className="text-xs text-muted font-mono">
              {dose.toFixed(1)} g · {doseLabel}
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={dose}
            onChange={(e) => setDose(parseFloat(e.target.value))}
            className="w-full accent-primary"
            aria-label="Acetaminophen dose in grams"
          />
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>0.5 g</span>
            <span>4 g</span>
            <span>10 g</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="text-sm font-semibold text-foreground">
              Glutathione (GSH)
            </label>
            <span className="text-xs text-muted font-mono">{gsh}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={gsh}
            onChange={(e) => setGsh(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500"
            aria-label="Glutathione level percentage"
          />
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>Depleted</span>
            <span>Full</span>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground mb-2">
            NAC Rescue Therapy
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              role="switch"
              aria-checked={nac}
              onClick={() => setNac((v) => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                nac ? "bg-emerald-500" : "bg-surface-light"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  nac ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-xs text-muted">
              {nac ? "Active — GSH capacity ×1.5" : "Off"}
            </span>
          </label>
          <p className="text-[10px] text-muted mt-2 leading-relaxed">
            N-acetylcysteine replenishes glutathione and is the clinical antidote
            for acetaminophen overdose.
          </p>
        </div>
      </div>

      {/* SVG Pathway */}
      <div className="rounded-xl border border-surface-light bg-background p-4 overflow-hidden">
        <svg
          viewBox="0 0 600 420"
          className="w-full h-auto"
          role="img"
          aria-label="Acetaminophen metabolic pathway diagram"
        >
          <defs>
            {/* Paths */}
            <path
              id="apap-to-ugt"
              d="M 300 60 Q 220 100, 160 160"
              fill="none"
            />
            <path
              id="apap-to-sult"
              d="M 300 60 L 300 160"
              fill="none"
            />
            <path
              id="apap-to-cyp"
              d="M 300 60 Q 380 100, 440 160"
              fill="none"
            />
            <path
              id="ugt-to-safe"
              d="M 160 180 L 160 320"
              fill="none"
            />
            <path
              id="sult-to-safe"
              d="M 300 180 L 300 260"
              fill="none"
            />
            <path
              id="cyp-to-napqi"
              d="M 440 180 L 440 240"
              fill="none"
            />
            <path
              id="napqi-to-gsh"
              d="M 440 260 Q 400 290, 360 300"
              fill="none"
            />
            <path
              id="napqi-to-liver"
              d="M 440 260 L 440 360"
              fill="none"
            />
          </defs>

          {/* Pathway stroke guides */}
          <g stroke="currentColor" fill="none" strokeWidth="1" strokeDasharray="2 4" opacity="0.25">
            <use href="#apap-to-ugt" />
            <use href="#apap-to-sult" />
            <use href="#apap-to-cyp" />
            <use href="#ugt-to-safe" />
            <use href="#sult-to-safe" />
            <use href="#cyp-to-napqi" />
            <use href="#napqi-to-gsh" />
            <use href="#napqi-to-liver" />
          </g>

          {/* Particles */}
          <Particles
            pathId="apap-to-ugt"
            count={particleCount(flux.glucuronidation)}
            duration={particleDuration(flux.glucuronidation)}
            color="#60a5fa"
          />
          <Particles
            pathId="ugt-to-safe"
            count={particleCount(flux.glucuronidation)}
            duration={particleDuration(flux.glucuronidation)}
            color="#60a5fa"
          />
          <Particles
            pathId="apap-to-sult"
            count={particleCount(flux.sulfation)}
            duration={particleDuration(flux.sulfation)}
            color="#2dd4bf"
          />
          <Particles
            pathId="sult-to-safe"
            count={particleCount(flux.sulfation)}
            duration={particleDuration(flux.sulfation)}
            color="#2dd4bf"
          />
          <Particles
            pathId="apap-to-cyp"
            count={particleCount(flux.cyp450, 10)}
            duration={particleDuration(flux.cyp450)}
            color="#f97316"
          />
          <Particles
            pathId="cyp-to-napqi"
            count={particleCount(flux.napqi, 10)}
            duration={particleDuration(flux.napqi)}
            color="#ef4444"
            radius={3.5}
          />
          <Particles
            pathId="napqi-to-gsh"
            count={particleCount(flux.gshRescue)}
            duration={particleDuration(flux.gshRescue)}
            color="#34d399"
          />
          <Particles
            pathId="napqi-to-liver"
            count={particleCount(flux.necrosis, 10)}
            duration={particleDuration(Math.max(flux.necrosis, 0.5))}
            color="#f43f5e"
            radius={3.5}
          />

          {/* APAP source node */}
          <g>
            <rect x="250" y="20" width="100" height="40" rx="8" fill="#1f2937" stroke="#e5e7eb" strokeWidth="2" />
            <text x="300" y="45" textAnchor="middle" fill="#e5e7eb" fontSize="14" fontWeight="600">
              APAP
            </text>
          </g>

          {/* UGT enzyme */}
          <g>
            <circle cx="160" cy="170" r="28" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
            <text x="160" y="168" textAnchor="middle" fill="#bfdbfe" fontSize="11" fontWeight="600">UGT</text>
            <text x="160" y="180" textAnchor="middle" fill="#bfdbfe" fontSize="8">glucuronidation</text>
          </g>

          {/* SULT enzyme */}
          <g>
            <circle cx="300" cy="170" r="28" fill="#134e4a" stroke="#2dd4bf" strokeWidth="2" />
            <text x="300" y="168" textAnchor="middle" fill="#99f6e4" fontSize="11" fontWeight="600">SULT</text>
            <text x="300" y="180" textAnchor="middle" fill="#99f6e4" fontSize="8">sulfation</text>
          </g>

          {/* CYP2E1 enzyme */}
          <g>
            <circle cx="440" cy="170" r="28" fill="#7c2d12" stroke="#f97316" strokeWidth="2" />
            <text x="440" y="168" textAnchor="middle" fill="#fed7aa" fontSize="11" fontWeight="600">CYP2E1</text>
            <text x="440" y="180" textAnchor="middle" fill="#fed7aa" fontSize="8">oxidation</text>
          </g>

          {/* Safe excretion node */}
          <g>
            <rect x="100" y="320" width="260" height="40" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <text x="230" y="345" textAnchor="middle" fill="#a7f3d0" fontSize="12" fontWeight="600">
              Safe Excretion (urine)
            </text>
          </g>

          {/* NAPQI node */}
          <g>
            <rect x="400" y="240" width="80" height="28" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
            <text x="440" y="258" textAnchor="middle" fill="#fecaca" fontSize="11" fontWeight="700">NAPQI</text>
          </g>

          {/* GSH buffer — width scales with gsh level */}
          <g>
            {(() => {
              const gshWidth = Math.max(30, 120 * (gsh / 100) * (nac ? 1.1 : 1));
              const gshFillColor =
                gsh < 30 ? "#7f1d1d" : gsh < 60 ? "#854d0e" : "#064e3b";
              const gshStrokeColor =
                gsh < 30 ? "#ef4444" : gsh < 60 ? "#eab308" : "#34d399";
              return (
                <>
                  <rect
                    x={360 - gshWidth}
                    y="285"
                    width={gshWidth}
                    height="30"
                    rx="15"
                    fill={gshFillColor}
                    stroke={gshStrokeColor}
                    strokeWidth="2"
                    style={{ transition: "all 0.3s" }}
                  />
                  <text
                    x={360 - gshWidth / 2}
                    y="304"
                    textAnchor="middle"
                    fill="#e5e7eb"
                    fontSize="11"
                    fontWeight="600"
                  >
                    GSH {gsh}%
                  </text>
                </>
              );
            })()}
          </g>

          {/* Hepatocyte outcome node */}
          <g>
            {status === "toxic" ? (
              <>
                <rect x="390" y="360" width="100" height="44" rx="8" fill="#450a0a" stroke="#f43f5e" strokeWidth="2" />
                <text x="440" y="380" textAnchor="middle" fill="#fecaca" fontSize="18">⚠</text>
                <text x="440" y="398" textAnchor="middle" fill="#fecaca" fontSize="10" fontWeight="600">Necrosis</text>
              </>
            ) : status === "stressed" ? (
              <>
                <rect x="390" y="360" width="100" height="44" rx="8" fill="#422006" stroke="#eab308" strokeWidth="2" />
                <text x="440" y="380" textAnchor="middle" fill="#fde68a" fontSize="16">◉</text>
                <text x="440" y="398" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="600">Stressed</text>
              </>
            ) : (
              <>
                <rect x="390" y="360" width="100" height="44" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
                <text x="440" y="380" textAnchor="middle" fill="#a7f3d0" fontSize="16">♥</text>
                <text x="440" y="398" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="600">Healthy</text>
              </>
            )}
          </g>
        </svg>
      </div>

      {/* Numeric readouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <Stat
          label="Glucuronidation"
          value={flux.glucuronidation.toFixed(2) + " g"}
          tone="blue"
          saturated={flux.glucuronidation >= VMAX_UGT - 0.01}
        />
        <Stat
          label="Sulfation"
          value={flux.sulfation.toFixed(2) + " g"}
          tone="teal"
          saturated={flux.sulfation >= VMAX_SULT - 0.01}
        />
        <Stat
          label="NAPQI produced"
          value={flux.napqi.toFixed(2) + " g"}
          tone={flux.napqi > 1 ? "red" : "orange"}
        />
        <Stat
          label="Liver damage"
          value={flux.necrosis > 0 ? flux.necrosis.toFixed(2) + " g" : "None"}
          tone={flux.necrosis > 0 ? "red" : "green"}
        />
      </div>

      {/* Try-these */}
      <div className="mt-6 pt-4 border-t border-surface-light">
        <p className="text-xs font-mono uppercase tracking-widest text-muted mb-2">
          Try these scenarios
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <PresetButton label="Therapeutic · 1 g" onClick={() => { setDose(1); setGsh(100); setNac(false); }} />
          <PresetButton label="High dose · 4 g" onClick={() => { setDose(4); setGsh(100); setNac(false); }} />
          <PresetButton label="Overdose · 8 g" onClick={() => { setDose(8); setGsh(100); setNac(false); }} />
          <PresetButton label="Overdose + depleted GSH" onClick={() => { setDose(8); setGsh(20); setNac(false); }} />
          <PresetButton label="Overdose + NAC rescue" onClick={() => { setDose(8); setGsh(20); setNac(true); }} />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  saturated,
}: {
  label: string;
  value: string;
  tone: "blue" | "teal" | "orange" | "red" | "green";
  saturated?: boolean;
}) {
  const toneClass =
    tone === "blue"
      ? "text-blue-400"
      : tone === "teal"
        ? "text-teal-300"
        : tone === "orange"
          ? "text-orange-400"
          : tone === "red"
            ? "text-red-400"
            : "text-emerald-400";
  return (
    <div className="rounded-lg border border-surface-light bg-background p-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">
        {label}
        {saturated && (
          <span className="ml-1 text-yellow-400">· saturated</span>
        )}
      </div>
      <div className={`text-lg font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full border border-surface-light text-muted hover:border-primary hover:text-primary transition-colors"
    >
      {label}
    </button>
  );
}
