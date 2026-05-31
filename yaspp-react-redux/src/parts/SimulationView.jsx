import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button, Collapse, Offcanvas, OffcanvasBody, OffcanvasHeader,
  Progress, Table, Input, Label,
} from 'reactstrap';
import { getAllMatchs, getAllTeams } from '../reducers/selectors/modelSelector';
import { getSelectedLeague, getSelectedYear } from '../reducers/selectors/uiSelector';
import {
  computeTeamParams, getRemainingMatches, getCurrentPoints,
  getSeasonTeamIds, isTournamentLeague, detectHostNations, getLeagueAvg,
} from '../simulation/params';
import { deriveGroups, getTournamentConfig } from '../simulation/tournament';
import './SimulationView.css';

const DEFAULT_GLOBAL = {
  homeAdvantage: 1.15,
  hostAdvantage: 1.08,
  alpha: 0.4,
  recentN: 10,
  gamma: 0.08,
  leagueAvgOverride: null,  // null = use computed; number = use this value
};

const GROUP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function probBg(p, danger = false) {
  if (p < 0.5) return undefined;
  const intensity = Math.min(p / 60, 1);
  const alpha = 0.08 + intensity * 0.52;
  return danger
    ? `rgba(220, 53, 69, ${alpha.toFixed(2)})`
    : `rgba(25, 135, 84, ${alpha.toFixed(2)})`;
}

function fmt(n)        { return Math.round(n * 10) / 10; }
function pct(cnt, n)   { return n ? Math.round(cnt / n * 1000) / 10 : 0; }
function sumRounds(r, ...keys) { return keys.reduce((s, k) => s + (r[k] || 0), 0); }

export default function SimulationView({ store, triggerClass }) {
  const [, setTick]           = useState(0);
  const [visible, setVisible] = useState(false);
  const [globalParams, setGlobalParams] = useState(DEFAULT_GLOBAL);
  const [overrides, setOverrides]       = useState({});
  const [nPaths, setNPaths]             = useState(10000);
  const [infoOpen, setInfoOpen]         = useState(false);
  const [simState, setSimState]         = useState('idle');
  const [progress, setProgress]         = useState(0);
  const [results, setResults]           = useState(null);   // { data, isTournament, nPaths }
  const [groupsData, setGroupsData]     = useState(null);   // [{ teamIds, matches }]
  const [inputsOpen, setInputsOpen]     = useState(true);
  const [groupsOpen, setGroupsOpen]     = useState(true);
  const [computedParams, setComputedParams] = useState({});
  const [leagueAvg, setLeagueAvg]           = useState(1.3);
  const [presetsData, setPresetsData]       = useState(null); // { data, league, year }
  const workerRef = useRef(null);

  useEffect(() => {
    const unsub = store.subscribe(() => setTick(t => t + 1));
    return unsub;
  }, [store]);

  useEffect(() => () => { workerRef.current?.terminate(); }, []);

  const getSeasonMatches = useCallback(() => {
    const st = store.getState();
    const league = getSelectedLeague(st);
    const year   = getSelectedYear(st);
    return (getAllMatchs(st) || []).filter(m => m.league === league && m.year === year);
  }, [store]);

  // Load preset params whenever the panel opens or league/year changes
  useEffect(() => {
    if (!visible) return;
    const st     = store.getState();
    const league = getSelectedLeague(st);
    const year   = getSelectedYear(st);
    if (presetsData?.league === league && presetsData?.year === year) return;

    const url = isTournamentLeague(league)
      ? `./data/wc26-params.json`                        // tournaments: fixed file
      : `./data/${league}-${year}-params.json`;          // leagues: per season

    fetch(url)
      .then(r => r.json())
      .then(d => setPresetsData({ data: d, league, year }))
      .catch(() => setPresetsData({ data: null, league, year })); // not available — suppress button
  }, [visible, store, presetsData]);

  // Recompute params when panel is open or alpha/N changes
  useEffect(() => {
    if (!visible) return;
    const season  = getSeasonMatches();
    const teamIds = getSeasonTeamIds(season);
    if (!teamIds.length || !season.length) return;
    const { teamParams, leagueAvg: avg } = computeTeamParams(
      season, teamIds, { alpha: globalParams.alpha, recentN: globalParams.recentN }
    );
    setComputedParams(teamParams);
    setLeagueAvg(avg);
    setOverrides({});
  }, [visible, store, getSeasonMatches, globalParams.alpha, globalParams.recentN]);

  // Reset when league/year changes
  useEffect(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setSimState('idle'); setProgress(0); setResults(null); setGroupsData(null);
  }, [getSeasonMatches]);

  const toggle = () => {
    if (visible) { workerRef.current?.terminate(); workerRef.current = null; setSimState('idle'); setProgress(0); }
    setVisible(v => !v);
  };

  function getEffectiveParams(teamIds) {
    const p = {};
    for (const id of teamIds) {
      const base = computedParams[id] || { attack: 1.0, defense: 1.0 };
      const ov   = overrides[id] || {};
      p[id] = {
        attack:  ov.attack  !== undefined ? Number(ov.attack)  : base.attack,
        defense: ov.defense !== undefined ? Number(ov.defense) : base.defense,
      };
    }
    return p;
  }

  function resetSim() {
    workerRef.current?.terminate(); workerRef.current = null;
    setSimState('idle'); setProgress(0); setResults(null); setGroupsData(null); setInputsOpen(true);
  }

  function applyPreset() {
    const pd = presetsData?.data;
    if (!pd) return;
    const newOverrides = {};
    for (const id of teamIds) {
      // Tournament (WC26): look up via teamIdMap first, then shortName alias chain
      // League (BL1 etc.): look up directly by numeric team ID
      const code = pd.teamIdMap?.[String(id)]
        || pd.codeMap?.[teams[id]?.shortName || '']
        || teams[id]?.shortName
        || String(id);
      const preset = pd.teams?.[code]
        || pd.teams?.[String(id)]          // BL1: keyed by numeric ID string
        || (pd.promotedTeamTemplate && !pd.teams?.[code] ? pd.promotedTeamTemplate : null);
      if (preset) newOverrides[id] = { attack: preset.attack, defense: preset.defense };
    }
    setOverrides(newOverrides);
    setGlobalParams(p => ({
      ...p,
      leagueAvgOverride: pd.leagueAvg ?? p.leagueAvgOverride,
      // Also apply calibrated home advantage if present (league preset)
      homeAdvantage: pd.homeAdvantage ?? p.homeAdvantage,
    }));
  }

  const effectiveLeagueAvg = globalParams.leagueAvgOverride ?? leagueAvg;

  function runSimulation() {
    const season          = getSeasonMatches();
    const teamIds         = getSeasonTeamIds(season);
    const effectiveParams = getEffectiveParams(teamIds);
    const tournamentCfg   = getTournamentConfig(selectedLeague);

    workerRef.current?.terminate();
    const worker = new Worker(new URL('../simulation/simulationWorker.js', import.meta.url));
    workerRef.current = worker;
    setSimState('running'); setProgress(0); setResults(null);

    worker.onmessage = (e) => {
      if (e.data.type === 'progress') {
        setProgress(Math.round(e.data.completed / e.data.total * 100));
      } else if (e.data.type === 'result') {
        setResults({ data: e.data.results, isTournament: !!e.data.isTournament, nPaths: e.data.nPaths });
        setSimState('done'); setProgress(100); setInputsOpen(false);
        worker.terminate(); workerRef.current = null;
      }
    };
    worker.onerror = (err) => {
      console.error('Worker error:', err);
      setSimState('error'); worker.terminate(); workerRef.current = null;
    };

    if (isTournament && tournamentCfg) {
      // ── Tournament mode ─────────────────────────────────────────────────
      const groupStageMatches = season.filter(m => m.matchDayId <= tournamentCfg.nGroupRounds);
      const groups = deriveGroups(groupStageMatches);
      const groupsWithMatches = groups.map(ids => ({
        teamIds: ids,
        matches: groupStageMatches.filter(m =>
          ids.includes(String(m.teamHomeId)) && ids.includes(String(m.teamAwayId))
        ),
      }));
      setGroupsData(groupsWithMatches);

      if (groupStageMatches.length === 0) {
        setSimState('done'); setResults(null); worker.terminate(); return;
      }

      worker.postMessage({
        isTournament: true,
        groupsWithMatches,
        nPaths,
        teamParams: effectiveParams,
        globalParams: {
          hostAdvantage: globalParams.hostAdvantage,
          hostNationIds,
          leagueAvg: effectiveLeagueAvg,
          gamma: globalParams.gamma,
          nBestThirds: tournamentCfg.nBestThirds,
        },
      });
    } else {
      // ── League mode ─────────────────────────────────────────────────────
      const remaining     = getRemainingMatches(season);
      const currentPoints = getCurrentPoints(season, teamIds);
      if (remaining.length === 0) {
        setSimState('done'); setResults(null); worker.terminate(); return;
      }
      worker.postMessage({
        isTournament: false,
        remainingMatches: remaining,
        currentPoints,
        teamParams: effectiveParams,
        globalParams: {
          homeAdvantage: globalParams.homeAdvantage,
          hostAdvantage: globalParams.hostAdvantage,
          hostNationIds,
          isTournament: false,
          leagueAvg: effectiveLeagueAvg,
          gamma: globalParams.gamma,
        },
        nPaths,
      });
    }
  }

  // ── Derived render-time values ─────────────────────────────────────────────
  const state          = store.getState();
  const teams          = getAllTeams(state) || {};
  const selectedLeague = getSelectedLeague(state);
  const selectedYear   = getSelectedYear(state);
  const seasonMatches  = getSeasonMatches();
  const teamIds        = getSeasonTeamIds(seasonMatches);
  const isTournament   = isTournamentLeague(selectedLeague);
  const hostNationIds  = isTournament ? detectHostNations(teams, teamIds, selectedLeague) : [];

  function teamName(id) {
    const t = teams[id];
    return t?.shortName || t?.name || id;
  }
  function teamLogo(id) {
    return teams[id]?.iconUrl;
  }

  // Sort for params table: by attack desc
  const paramSortedIds = [...teamIds].sort(
    (a, b) => (computedParams[b]?.attack || 1) - (computedParams[a]?.attack || 1)
  );

  // Sort for results table
  const resultSortedIds = results
    ? results.isTournament
      ? [...teamIds].sort((a, b) => {
          const ra = results.data[a]?.rounds || {};
          const rb = results.data[b]?.rounds || {};
          // weight by round depth
          const score = r => (r.Champion||0)*6 + (r.Final||0)*5 + (r.SF||0)*4 +
                             (r.QF||0)*3 + (r.R16||0)*2 + (r.R32||0);
          return score(rb) - score(ra);
        })
      : [...teamIds].sort((a, b) =>
          (results.data[b]?.avgPoints || 0) - (results.data[a]?.avgPoints || 0)
        )
    : paramSortedIds;

  const nTeams   = teamIds.length;
  const N        = results?.nPaths || nPaths;

  function setGlobal(key, val)       { setGlobalParams(p => ({ ...p, [key]: Number(val) })); }
  function setOverride(id, key, val) { setOverrides(o => ({ ...o, [id]: { ...(o[id]||{}), [key]: val } })); }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Button className={triggerClass || 'btn btn-sm'} onClick={toggle} title="Saison-Simulation">
        <FontAwesomeIcon icon="chart-bar" />
      </Button>

      <Offcanvas fade isOpen={visible} toggle={toggle} direction="end" backdrop={false}
        style={{ width: '100%', maxWidth: 660, overflowY: 'auto' }}>
        <OffcanvasHeader toggle={toggle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Saison-Simulation
            {selectedLeague && selectedYear && (
              <span className="sim-header-sub">{selectedLeague.toUpperCase()} {selectedYear}</span>
            )}
            <button
              className={`sim-info-btn${infoOpen ? ' active' : ''}`}
              onClick={e => { e.stopPropagation(); setInfoOpen(o => !o); }}
              title="Erklärung: Parameter & Simulationsmethodik"
            >
              <FontAwesomeIcon icon="info" />
            </button>
          </span>
        </OffcanvasHeader>

        <OffcanvasBody className="sim-body">

          {/* ── Info panel ──────────────────────────────────────── */}
          <Collapse isOpen={infoOpen}>
            <div className="sim-info-panel">

              <div className="sim-info-section">
                <div className="sim-info-title">Teamparameter</div>
                <p>Jedes Team bekommt zwei Werte, normiert auf den Liga-Durchschnitt (= 1,0):</p>
                <div className="sim-info-table">
                  <div className="sim-info-row">
                    <span className="sim-info-label">Angriff</span>
                    <span>Ø erzielte Tore / Liga-Ø &nbsp;|&nbsp; <b>&gt; 1</b> = starker Angriff</span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Abwehr</span>
                    <span>Ø kassierte Tore / Liga-Ø &nbsp;|&nbsp; <b>&gt; 1</b> = schwache Abwehr</span>
                  </div>
                </div>
                <p className="sim-info-note">
                  Berechnung: gleitender Durchschnitt der letzten N Spiele, normiert so dass der
                  geometrische Mittelwert aller Teams = 1,0 ist.
                  &nbsp;<b>Preset</b>: kalibrierte Werte aus der Vorsaison (vollständig berechnete
                  Saisonstatistik ± FIFA-Ranking für Turniere).
                </p>
              </div>

              <div className="sim-info-section">
                <div className="sim-info-title">Globale Parameter</div>
                <div className="sim-info-table">
                  <div className="sim-info-row">
                    <span className="sim-info-label">Heimvorteil</span>
                    <span>
                      Multiplikator für den Heimvorteil.<br />
                      <code>λ_Heim = Angriff × Abwehr_Gegner × <b>Heimvorteil</b> × Liga-Ø</code><br />
                      <code>λ_Auswärts = Angriff × Abwehr_Gegner / <b>Heimvorteil</b> × Liga-Ø</code>
                    </span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Gastgebervorteil</span>
                    <span>
                      Wie Heimvorteil, aber nur für Gastgebernationen (z. B. USA/Kanada/Mexiko bei WM26).
                      Alle anderen Spiele finden auf neutralem Boden statt (Faktor = 1,0).
                    </span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Liga-Ø</span>
                    <span>Durchschnittliche Tore pro Team pro Spiel. Kalibrierter Preset-Wert aus der Vorsaison.</span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Gewichtung α</span>
                    <span>
                      Mischung zwischen langfristigem Preset und aktuellem Saisonverlauf.<br />
                      <code>α = 0</code>: nur Preset &nbsp;|&nbsp; <code>α = 1</code>: nur aktuelle Saison
                    </span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Letzte N Spiele</span>
                    <span>Fenster für die Formberechnung aus dem laufenden Saisonverlauf.</span>
                  </div>
                  <div className="sim-info-row">
                    <span className="sim-info-label">Lernrate γ</span>
                    <span>
                      EMA-Update der Teamstärke nach jedem simulierten Spiel innerhalb eines Pfades.
                      Ein höheres γ erzeugt stärkere Auf- und Abschwünge (Streaks).
                      <br /><code>atk_neu = (1−γ)·atk_alt + γ·(Tore / Liga-Ø)</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="sim-info-section">
                <div className="sim-info-title">Simulationsmodell</div>
                <p>
                  Für jedes Spiel werden die erwarteten Tore (λ) mit obiger Formel berechnet.
                  Die tatsächlichen Tore werden dann per <b>Poisson-Zufallsvariable</b> gezogen:
                  eine Verteilung, die kleine ganzzahlige Ereignisse (Tore) gut beschreibt.
                </p>
                <p>
                  Pro <b>Simulationspfad</b> wird die gesamte verbleibende Saison einmal durchgespielt.
                  Nach jedem Spiel werden die Teamparameter per EMA (Lernrate γ) angepasst —
                  ein Team, das gut spielt, bekommt höhere Werte für die Folgesspiele desselben Pfades.
                  Das erzeugt realistische <b>Auf- und Abschwünge (Streaks)</b>.
                </p>
                <p>
                  Mit <b>10 000 Pfaden</b> entstehen stabile Wahrscheinlichkeiten (Varianz &lt; 0,5 %).
                </p>

                <div className="sim-info-title" style={{ marginTop: 10 }}>Liga (z. B. Bundesliga)</div>
                <p>
                  Alle verbleibenden Spiele werden simuliert und Punkte akkumuliert.
                  Das Ergebnis zeigt die Wahrscheinlichkeiten für jeden Tabellenplatz sowie
                  Ø-Punkte und Punktespanne (min–max).
                </p>

                <div className="sim-info-title" style={{ marginTop: 10 }}>Turnier (z. B. WM)</div>
                <p>Dreistufiger Ablauf pro Pfad:</p>
                <ol className="sim-info-ol">
                  <li>
                    <b>Gruppenphase</b>: Alle verbleibenden Gruppenspiele werden simuliert.
                    Abschlusstabellen pro Gruppe (Punkte → Tordifferenz → Tore → Zufalls-Tiebreak).
                    Je Gruppe: 1. und 2. qualifiziert. Die 8 besten Drittplatzierten auch (WM26).
                  </li>
                  <li>
                    <b>Bracket-Setzung</b>: Die 32 qualifizierten Teams werden nach Leistung gereiht
                    (Gruppensieger Rang 1–12, Zweite 13–24, beste Dritte 25–32) und in ein
                    Standard-K.o.-Bracket gesetzt. Rang 1 und 2 können erst im Finale aufeinandertreffen.
                  </li>
                  <li>
                    <b>K.o.-Runden</b> (R32 → R16 → QF → HF → Finale):
                    Alle Spiele auf neutralem Boden. Unentschieden → Verlängerung (30 min, ⅓ Rate).
                    Noch unentschieden → 50/50 Elfmeterschießen.
                  </li>
                </ol>
              </div>

            </div>
          </Collapse>

          {/* ── Collapsible parameter block ─────────────────────── */}
          <div className="sim-section">
            <div className="sim-section-title sim-collapse-toggle" onClick={() => setInputsOpen(o => !o)}>
              <FontAwesomeIcon icon={inputsOpen ? 'caret-down' : 'caret-right'} className="sim-caret" />
              Parameter
              {presetsData?.data && (
                <button className="sim-preset-btn"
                  onClick={e => { e.stopPropagation(); applyPreset(); setInputsOpen(true); }}
                  title={`Kalibrierte Parameter für ${selectedLeague?.toUpperCase()} ${selectedYear} anwenden`}>
                  🎯 {selectedLeague?.toUpperCase()}-Preset
                </button>
              )}
            </div>
          </div>

          <Collapse isOpen={inputsOpen}>
            {/* Global params */}
            <div className="sim-section">
              <div className="sim-section-title">Globale Parameter</div>
              <div className="sim-global-grid">
                {isTournament ? (
                  <>
                    <Label>Gastgebervorteil</Label>
                    <div className="sim-input-hint">
                      <Input type="number" bsSize="sm" min="1" max="2" step="0.02"
                        value={globalParams.hostAdvantage}
                        onChange={e => setGlobal('hostAdvantage', e.target.value)} />
                      <span>gilt nur für Gastgeber-Nationen</span>
                    </div>
                    <Label>Gastgeber</Label>
                    <div className="sim-host-nations">
                      {hostNationIds.length > 0
                        ? hostNationIds.map(id => (
                            <span key={id} className="sim-host-tag">
                              {teamLogo(id) && <img src={teamLogo(id)} alt="" className="sim-team-logo" />}
                              {teamName(id)}
                            </span>
                          ))
                        : <span className="sim-hint">keine erkannt</span>}
                    </div>
                  </>
                ) : (
                  <>
                    <Label>Heimvorteil</Label>
                    <div className="sim-input-hint">
                      <Input type="number" bsSize="sm" min="1" max="2" step="0.05"
                        value={globalParams.homeAdvantage}
                        onChange={e => setGlobal('homeAdvantage', e.target.value)} />
                      <span>λ_Heim = Angriff × Abwehr × <b>{globalParams.homeAdvantage}</b> × ⌀</span>
                    </div>
                  </>
                )}
                <Label>Gewichtung Formwerte (α)</Label>
                <div className="sim-input-hint">
                  <Input type="number" bsSize="sm" min="0" max="1" step="0.05"
                    value={globalParams.alpha} onChange={e => setGlobal('alpha', e.target.value)} />
                  <span>0 = nur Langzeit, 1 = nur letzten N</span>
                </div>
                <Label>Letzte N Spiele</Label>
                <Input type="number" bsSize="sm" min="3" max="34" step="1"
                  value={globalParams.recentN} onChange={e => setGlobal('recentN', e.target.value)} />
                <Label>Lernrate γ</Label>
                <div className="sim-input-hint">
                  <Input type="number" bsSize="sm" min="0" max="0.3" step="0.01"
                    value={globalParams.gamma} onChange={e => setGlobal('gamma', e.target.value)} />
                  <span>EMA pro Spiel</span>
                </div>
              <Label>Liga-Ø (Tore/Team/Sp)</Label>
                <div className="sim-input-hint">
                  <Input type="number" bsSize="sm" min="0.5" max="3" step="0.05"
                    value={fmt(effectiveLeagueAvg)}
                    onChange={e => setGlobalParams(p => ({ ...p, leagueAvgOverride: Number(e.target.value) }))} />
                  <span className={globalParams.leagueAvgOverride != null ? 'sim-preset-active' : ''}>
                    {globalParams.leagueAvgOverride != null ? 'überschrieben' : 'aus Saison-Daten'}
                  </span>
                </div>
              </div>
            </div>

            {/* Team params */}
            <div className="sim-section">
              <div className="sim-section-title">
                Teamparameter
                <span className="sim-hint"> — normiert auf {fmt(effectiveLeagueAvg)} T/Sp</span>
              </div>
              <Table size="sm" className="sim-params-table">
                <thead>
                  <tr>
                    <th>Team</th>
                    <th title="Erzielte Tore / Liga-Ø">Angriff</th>
                    <th title="Kassierte Tore / Liga-Ø">Abwehr</th>
                  </tr>
                </thead>
                <tbody>
                  {paramSortedIds.map(id => {
                    const base = computedParams[id] || { attack: 1.0, defense: 1.0 };
                    const ov   = overrides[id] || {};
                    return (
                      <tr key={id}>
                        <td className="sim-team-cell">
                          {teamLogo(id) && <img src={teamLogo(id)} alt="" className="sim-team-logo" />}
                          {teamName(id)}
                        </td>
                        <td>
                          <Input type="number" bsSize="sm" className="sim-param-input"
                            min="0" max="5" step="0.05"
                            value={ov.attack !== undefined ? ov.attack : fmt(base.attack)}
                            onChange={e => setOverride(id, 'attack', e.target.value)} />
                        </td>
                        <td>
                          <Input type="number" bsSize="sm" className="sim-param-input"
                            min="0" max="5" step="0.05"
                            value={ov.defense !== undefined ? ov.defense : fmt(base.defense)}
                            onChange={e => setOverride(id, 'defense', e.target.value)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Collapse>

          {/* ── Simulation controls ─────────────────────────────── */}
          <div className="sim-section">
            <div className="sim-section-title">Simulation</div>
            <div className="sim-controls-row">
              <Label className="mb-0">Pfade</Label>
              <Input type="number" bsSize="sm" min="100" max="50000" step="500"
                value={nPaths} style={{ width: 110 }}
                disabled={simState === 'running'}
                onChange={e => setNPaths(Number(e.target.value))} />
              <Button color="primary" size="sm" disabled={simState === 'running'} onClick={runSimulation}>
                {simState === 'running' ? 'Läuft…' : 'Starten'}
              </Button>
              {simState !== 'idle' && (
                <Button color="secondary" size="sm" outline onClick={resetSim}>Reset</Button>
              )}
            </div>
            {simState === 'running' && (
              <Progress animated value={progress} className="sim-progress">{progress}%</Progress>
            )}
            {simState === 'error' && (
              <div className="sim-error">Simulationsfehler — bitte Konsole prüfen.</div>
            )}
          </div>

          {simState === 'done' && !results && (
            <div className="sim-complete">Keine offenen Spiele / Daten fehlen.</div>
          )}

          {/* ════════════════════════════════════════════════════════
              TOURNAMENT RESULTS
              ════════════════════════════════════════════════════════ */}
          {results?.isTournament && groupsData && (
            <>
              {/* ── Group stage standings ──────────────────────── */}
              <div className="sim-section">
                <div className="sim-section-title sim-collapse-toggle"
                  onClick={() => setGroupsOpen(o => !o)}>
                  <FontAwesomeIcon icon={groupsOpen ? 'caret-down' : 'caret-right'} className="sim-caret" />
                  Gruppenphase
                  <span className="sim-hint"> — {N.toLocaleString()} Pfade</span>
                </div>
              </div>
              <Collapse isOpen={groupsOpen}>
                <div className="sim-groups-grid">
                  {groupsData.map((group, gi) => {
                    const letter = GROUP_LETTERS[gi] || gi + 1;
                    const sorted = [...group.teamIds].sort((a, b) => {
                      const ga = results.data[a]?.groupPos || [0,0,0,0];
                      const gb = results.data[b]?.groupPos || [0,0,0,0];
                      return (gb[0]+gb[1]) - (ga[0]+ga[1]) || gb[0] - ga[0];
                    });
                    return (
                      <div key={gi} className="sim-group-card">
                        <div className="sim-group-label">Gruppe {letter}</div>
                        <Table size="sm" className="sim-group-table">
                          <thead>
                            <tr>
                              <th>Team</th>
                              <th title="1. Platz">1.</th>
                              <th title="2. Platz">2.</th>
                              <th title="Als bester Dritter weiter">3.▲</th>
                              <th title="Ausgeschieden">Out</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sorted.map(id => {
                              const r  = results.data[id];
                              const gp = r?.groupPos || [0,0,0,0];
                              const ro = r?.rounds   || {};
                              const p1   = pct(gp[0], N);
                              const p2   = pct(gp[1], N);
                              const pAdv = pct(N - (ro.groupExit||0), N);
                              const p3adv = Math.max(0, Math.round((pAdv - p1 - p2) * 10) / 10);
                              const pOut = pct(ro.groupExit||0, N);
                              return (
                                <tr key={id}>
                                  <td className="sim-team-cell">
                                    {teamLogo(id) && <img src={teamLogo(id)} alt="" className="sim-team-logo" />}
                                    {teamName(id)}
                                  </td>
                                  <td className="sim-prob" style={{ background: probBg(p1) }}>{p1}%</td>
                                  <td className="sim-prob" style={{ background: probBg(p2) }}>{p2}%</td>
                                  <td className="sim-prob" style={{ background: probBg(p3adv) }}>{p3adv}%</td>
                                  <td className="sim-prob" style={{ background: probBg(pOut, true) }}>{pOut}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              </Collapse>

              {/* ── Knockout probabilities ─────────────────────── */}
              <div className="sim-section">
                <div className="sim-section-title">
                  KO-Wahrscheinlichkeiten
                  <span className="sim-hint"> — alle {nTeams} Teams</span>
                </div>
                <Table size="sm" className="sim-results-table" responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Team</th>
                      <th title="Ausgeschieden in der Gruppenphase" className="sim-prob-col">Grp</th>
                      <th title="Ausgeschieden im Achtelfinale / R32" className="sim-prob-col">R32</th>
                      <th title="Ausgeschieden im Sechzehntelfinale / R16" className="sim-prob-col">R16</th>
                      <th title="Top 16 — Viertelfinale oder besser" className="sim-prob-col">T16</th>
                      <th title="Top 8 — Halbfinale oder besser" className="sim-prob-col">T8</th>
                      <th title="Finalist (2. Platz)" className="sim-prob-col">Fin</th>
                      <th title="Weltmeister" className="sim-prob-col">🏆</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultSortedIds.map((id, idx) => {
                      const r  = results.data[id]?.rounds || {};
                      const pGrpOut = pct(r.groupExit||0, N);
                      const pR32out = pct(r.R32||0, N);
                      const pR16out = pct(r.R16||0, N);
                      const top16   = pct(sumRounds(r,'R16','QF','SF','Final','Champion'), N);
                      const top8    = pct(sumRounds(r,'QF','SF','Final','Champion'), N);
                      const pFinal  = pct(r.Final||0, N);
                      const pWin    = pct(r.Champion||0, N);
                      return (
                        <tr key={id}>
                          <td className="sim-rank">{idx + 1}</td>
                          <td className="sim-team-cell">
                            {teamLogo(id) && <img src={teamLogo(id)} alt="" className="sim-team-logo" />}
                            {teamName(id)}
                          </td>
                          <td className="sim-prob" style={{ background: probBg(pGrpOut, true) }}>{pGrpOut}%</td>
                          <td className="sim-prob" style={{ background: probBg(pR32out, true) }}>{pR32out}%</td>
                          <td className="sim-prob" style={{ background: probBg(pR16out, true) }}>{pR16out}%</td>
                          <td className="sim-prob" style={{ background: probBg(top16) }}>{top16}%</td>
                          <td className="sim-prob" style={{ background: probBg(top8) }}>{top8}%</td>
                          <td className="sim-prob" style={{ background: probBg(pFinal) }}>{pFinal}%</td>
                          <td className="sim-prob" style={{ background: probBg(pWin) }}>{pWin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </>
          )}

          {/* ════════════════════════════════════════════════════════
              LEAGUE RESULTS
              ════════════════════════════════════════════════════════ */}
          {results && !results.isTournament && (
            <div className="sim-section">
              <div className="sim-section-title">
                Ergebnisse
                <span className="sim-hint"> — {N.toLocaleString()} Pfade</span>
              </div>
              <Table size="sm" className="sim-results-table" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th title="Ø Abschlusspunkte">Ø Pkt</th>
                    <th title="Min–Max">Spanne</th>
                    <th className="sim-prob-col" title="Meister">1.</th>
                    <th className="sim-prob-col" title="Top 4">T4</th>
                    <th className="sim-prob-col" title="Abstieg (letzte 3)">Abst.</th>
                  </tr>
                </thead>
                <tbody>
                  {resultSortedIds.map((id, idx) => {
                    const r = results.data[id];
                    if (!r) return null;
                    const c    = r.positionCounts;
                    const p1   = pct(c[1]||0, N);
                    const top4 = pct([1,2,3,4].reduce((s,p) => s + (c[p]||0), 0), N);
                    const rel  = pct([nTeams, nTeams-1, nTeams-2].reduce((s,p) => s + (c[p]||0), 0), N);
                    return (
                      <tr key={id}>
                        <td className="sim-rank">{idx + 1}</td>
                        <td className="sim-team-cell">
                          {teamLogo(id) && <img src={teamLogo(id)} alt="" className="sim-team-logo" />}
                          {teamName(id)}
                        </td>
                        <td className="sim-avg">{r.avgPoints}</td>
                        <td className="sim-range">{r.minPoints}–{r.maxPoints}</td>
                        <td className="sim-prob" style={{ background: probBg(p1) }}>{p1}%</td>
                        <td className="sim-prob" style={{ background: probBg(top4) }}>{top4}%</td>
                        <td className="sim-prob" style={{ background: probBg(rel, true) }}>{rel}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

        </OffcanvasBody>
      </Offcanvas>
    </>
  );
}
