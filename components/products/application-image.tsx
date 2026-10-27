const scenes: Record<string, { sheet: string; column: number; row: number }> = {
  'anti-wear-hydraulic-oil': { sheet: 'industrial', column: 0, row: 0 },
  'slideway-oil': { sheet: 'industrial', column: 1, row: 0 },
  'automotive-engine-oil': { sheet: 'industrial', column: 2, row: 0 },
  'gear-oil': { sheet: 'industrial', column: 0, row: 1 },
  'vacuum-pump-oil': { sheet: 'industrial', column: 1, row: 1 },
  'lubricating-grease': { sheet: 'industrial', column: 2, row: 1 },
  'fully-synthetic-cutting-fluid': { sheet: 'metalworking', column: 0, row: 0 },
  'semi-synthetic-cutting-fluid': { sheet: 'metalworking', column: 1, row: 0 },
  'micro-emulsion-cutting-fluid': { sheet: 'metalworking', column: 2, row: 0 },
  'industrial-white-oil': { sheet: 'metalworking', column: 0, row: 1 },
  'cutting-oil': { sheet: 'metalworking', column: 1, row: 1 },
}

export function ApplicationImage({ slug, name, className = '' }: { slug: string; name: string; className?: string }) {
  const scene = scenes[slug]
  if (!scene) return null
  return (
    <div
      role="img"
      aria-label={`AI-generated illustrative application scene for ${name}; not an actual MICONG product or facility photograph`}
      className={`relative overflow-hidden bg-paper-2 ${className}`}
    >
      <div
        className="absolute inset-0 bg-no-repeat transition-transform duration-500 group-hover:scale-[1.025]"
        style={{
          backgroundImage: `url(/images/${scene.sheet}-applications-ai.png)`,
          backgroundSize: '300% 200%',
          backgroundPosition: `${scene.column * 50}% ${scene.row * 100}%`,
        }}
      />
      <span className="absolute bottom-2 left-2 rounded-sm bg-white/95 px-2 py-1 text-[10px] font-medium text-ink">Illustrative scene</span>
    </div>
  )
}
