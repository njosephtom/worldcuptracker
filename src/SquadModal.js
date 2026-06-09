import React from 'react';
import { flagLabel } from './data';
import { getTeamSquad } from './squads';

export function SquadModal({ team, onClose }) {
  if (!team) return null;

  const squad = getTeamSquad(team);

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
        <div style={styles.sectionLabel}>Squad Players</div>
        <div style={styles.playerGrid}>
          {squad.players.map((player) => (
            <div key={player} style={styles.playerCard}>{player}</div>
          ))}
        </div>
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
    width: 'min(560px, 100%)',
    background: '#0f1828',
    border: '1px solid #223252',
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
    color: '#f0c040',
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle: {
    color: '#8090a7',
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    background: '#111d30',
    border: '1px solid #29405f',
    color: '#d8d2c6',
    borderRadius: 8,
    padding: '7px 12px',
    cursor: 'pointer',
    fontSize: 11,
  },
  sectionLabel: {
    color: '#5f7597',
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
    background: '#111d30',
    border: '1px solid #1c2e49',
    borderRadius: 10,
    padding: '10px 12px',
    color: '#d8d2c6',
    fontSize: 12,
  },
};