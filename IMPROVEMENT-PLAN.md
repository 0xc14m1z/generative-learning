# Interactive Learning Explorer — Piano di Miglioramento

**Score iniziale:** 52/100
**Score target:** ~100/100
**Data inizio:** 2026-03-14

---

## Fase 1: Dev Mode con Hot Reload + Dati Reali
**Impatto:** +15 punti | **Sforzo:** Basso | **Status:** ✅ DONE (2026-03-15)

Il problema principale: per testare qualsiasi modifica alla UI serve build + inject + open file.
L'obiettivo e' poter lanciare `npm run dev` e vedere l'app con dati reali, con hot reload.

### Task
- [x] 1.1 — Modificare `loader.ts` per supportare fetch di JSON esterni in dev mode
- [x] 1.2 — Aggiungere sample data realistico (12 sezioni, tutti 11 viz type)
- [x] 1.3 — Aggiungere script `npm run preview:data` che copia dati in `public/dev-data/`
- [x] 1.4 — Aggiungere Vite plugin che rileva modifiche in `dev-data/` e fa auto-reload
- [x] 1.5 — Documentare il workflow di sviluppo in SKILL.md
- [x] 1.6 — Fix dependency versions (Vite 7 + plugin-react 5, tsconfig types)

### Cosa e' stato fatto
- `loader.ts` — async `loadDevData()` che in dev mode fetcha da `/dev-data/` con cache-busting
- `App.tsx` — integra dev data loading (renders con sample data, poi swap se dev-data esiste)
- `vite.config.ts` — plugin `devDataWatcher` che triggera full-reload su cambiamenti in dev-data/
- `scripts/preview-data.mjs` — copia JSON da una cartella qualsiasi in `public/dev-data/`
- `src/data/structure.json` — 12 sezioni, topic "How the Web Works", tutti 11 viz types
- `src/data/content.json` — 12 sezioni complete con 4 livelli, concepts, deep dives, references
- Dependency fix: Vite 8→7, plugin-react 6→5, aggiunto `vite/client` types

---

## Fase 2: Zod Validation + Error Boundaries
**Impatto:** +12 punti | **Sforzo:** Medio | **Status:** ⬜ TODO

Nessuna validazione dei JSON generati dall'AI. Un campo mancante crasha tutto silenziosamente.

### Task
- [ ] 2.1 — Definire schema Zod per `structure.json` (con tutti i campi e vincoli)
- [ ] 2.2 — Definire schema Zod per `content.json` (incluso validation per ogni viz type)
- [ ] 2.3 — Integrare validazione nel `loader.ts` con errori chiari e fallback
- [ ] 2.4 — Aggiungere Error Boundaries per VizRouter e SectionRenderer
- [ ] 2.5 — Creare script CLI: `npm run validate -- <structure.json> <content.json>`
- [ ] 2.6 — Aggiungere validazione anche in `inject.py` (pre-injection check)

---

## Fase 3: Sostituire Regex HTML con Parser React
**Impatto:** +8 punti | **Sforzo:** Medio | **Status:** ⬜ TODO

`SectionRenderer` usa regex su stringhe HTML + `dangerouslySetInnerHTML`. Fragile e non-React.

### Task
- [ ] 3.1 — Aggiungere `html-react-parser` come dipendenza
- [ ] 3.2 — Refactorare `SectionRenderer` per parsare HTML in componenti React
- [ ] 3.3 — Rendere `concept-trigger` un componente React nativo (ConceptTrigger)
- [ ] 3.4 — Rendere le citazioni un componente React nativo (CitationLink)
- [ ] 3.5 — Eliminare tutti gli usi di `dangerouslySetInnerHTML` dove possibile
- [ ] 3.6 — Verificare che tutti i viz type e i contenuti di esempio funzionino

---

## Fase 4: Type Safety Visualizzazioni
**Impatto:** +4 punti | **Sforzo:** Basso | **Status:** ⬜ TODO

Tutte le visualizzazioni ricevono `Record<string, unknown>`. Zero type safety.

### Task
- [ ] 4.1 — Definire interfaccia TypeScript per ogni viz type (PipelineData, StatCardsData, ecc.)
- [ ] 4.2 — Aggiornare VizRouter con type narrowing basato su `type`
- [ ] 4.3 — Aggiornare ogni componente visualizzazione con i tipi specifici
- [ ] 4.4 — Rimuovere tutti i cast `as any` / `as unknown`

---

## Fase 5: Accessibilita' Base
**Impatto:** +5 punti | **Sforzo:** Medio | **Status:** ⬜ TODO

Zero ARIA, zero focus management, zero screen reader support.

### Task
- [ ] 5.1 — Aggiungere `role="navigation"` e `aria-label` alla Sidebar
- [ ] 5.2 — Aggiungere `aria-expanded` e `aria-controls` ai collapsible (DeepDivePanel, concepts)
- [ ] 5.3 — Aggiungere `role="slider"` e ARIA attrs al depth selector
- [ ] 5.4 — Focus management: quando si cambia sezione, focus sul titolo
- [ ] 5.5 — Skip-to-content link
- [ ] 5.6 — Testare con VoiceOver (macOS)

---

## Fase 6: Features UX
**Impatto:** +5 punti | **Sforzo:** Medio-Alto | **Status:** ⬜ TODO

Feature mancanti per rendere l'esperienza completa.

### Task
- [ ] 6.1 — Deep-link a sezione via URL hash (`#section-id`)
- [ ] 6.2 — Ricerca full-text nei contenuti
- [ ] 6.3 — Progress tracking (sezioni visitate, persistito in localStorage)
- [ ] 6.4 — Print/export mode (CSS print-friendly)
- [ ] 6.5 — Breadcrumb / mini-TOC per sezioni lunghe

---

## Fase 7: Test Suite Base
**Impatto:** +3 punti | **Sforzo:** Medio | **Status:** ⬜ TODO

Zero test in tutto il progetto.

### Task
- [ ] 7.1 — Setup Vitest
- [ ] 7.2 — Test per `loader.ts` (fallback, window globals, invalid data)
- [ ] 7.3 — Test per `inject.py` (happy path, missing placeholders, unicode)
- [ ] 7.4 — Test per VizRouter (routing corretto per ogni tipo)
- [ ] 7.5 — Test per Zod schemas (valid + invalid payloads)
- [ ] 7.6 — Snapshot test per rendering di una sezione completa

---

## Score Tracker

| Milestone | Score | Data |
|-----------|-------|------|
| Stato iniziale | 52/100 | 2026-03-14 |
| Post Fase 1 | 67/100 | 2026-03-15 |
| Post Fase 2 | —/100 | — |
| Post Fase 3 | —/100 | — |
| Post Fase 4 | —/100 | — |
| Post Fase 5 | —/100 | — |
| Post Fase 6 | —/100 | — |
| Post Fase 7 | —/100 | — |
