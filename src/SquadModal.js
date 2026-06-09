import React, { useEffect, useState } from 'react';
import { flagLabel } from './data';
import { getFallbackTeamSquad, getTeamSquad } from './squads';

export function SquadModal({ team, onClose }) {
  const [squad, setSquad] = useState({ coach: 'Unknown', players: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!team) {
      setSquad({ coach: 'Unknown', players: [] });
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setSquad(getFallbackTeamSquad(team));
    setLoading(true);

    getTeamSquad(team)
      .then((data) => {
        if (!cancelled) setSquad(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [team]);

  if (!team) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>{flagLabel(team)}</div>
            <div style={styles.subtitle}>Coach: {squad.coach}</div>
          </div>
          <button type="button" onClick={onClose} style={styles.closeButton}>Close</button>
        </div>
        <div style={styles.sectionLabel}>
          {loading ? 'Loading squad…' : `Squad · ${squad.players.length} players`}
        </div>
        {squad.players.length > 0 ? (
          ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'].map(pos => {
            const group = squad.players.filter(p => p.includes(`(${pos})`));
            if (group.length === 0) return null;
            return (
              <div key={pos} style={{ marginBottom: 10 }}>
                <div style={styles.posLabel}>{pos}s</div>
                <div style={styles.playerGrid}>
                  {group.map(p => (
                    <div key={p} style={styles.playerCard}>
                      {p.replace(` (${pos})`, '')}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          !loading && <div style={styles.empty}>No squad data available.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(3, 8, 18, 0.84)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    width: 'min(600px, 100%)',
    maxHeight: '85vh',
    overflowY: 'auto',
    background: 'var(--bg-card)',
    border: '1px solid var(--bd-modal)',
    borderRadius: 14,
    boxShadow: '0 20px 60px rgba(0,0,0,.55)',
    padding: 18,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    color: 'var(--ac-gold)',
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle: {
    color: 'var(--tx-subtitle)',
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-close)',
    color: 'var(--tx-player)',
    borderRadius: 8,
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: 11,
  },
  sectionLabel: {
    color: 'var(--tx-muted)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.9px',
    marginBottom: 10,
  },
  playerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 10,
  },
  playerCard: {
    background: 'var(--bg-inner)',
    border: '1px solid var(--bd-player)',
    borderRadius: 10,
    padding: '10px 12px',
    color: 'var(--tx-player)',
    fontSize: 12,
  },
  posLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: 'var(--ac-gold)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: 6,
  },
  empty: {
    color: 'var(--tx-subtitle)',
    fontSize: 12,
    padding: '6px 2px',
  },
};