import React from 'react';
import { Modal, TextInput, NumberInput, Checkbox, Button } from '@mantine/core';
import { PlayerData } from './Field';

interface PlayerModalProps {
  translations: Record<string, string>;
  opened: boolean;
  selectedPlayerId: string | null;
  players: Record<string, PlayerData>;
  onClose: () => void;
  onPlayerChange: (id: string, field: keyof PlayerData, value: string | boolean | number) => void;
  onSave: () => void;
}

export function PlayerModal({
  translations,
  opened,
  selectedPlayerId,
  players,
  onClose,
  onPlayerChange,
  onSave,
}: PlayerModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={translations.editPlayer} centered>
      {selectedPlayerId && (
        <div>
          <TextInput
            label={translations.surname}
            value={players[selectedPlayerId]?.name || ''}
            onChange={(e) => onPlayerChange(selectedPlayerId, 'name', e.target.value)}
            mb="sm"
          />
          <NumberInput
            label={translations.number}
            value={players[selectedPlayerId]?.number || 1}
            onChange={(value) => onPlayerChange(selectedPlayerId, 'number', value || 1)}
            min={1}
            max={99}
            step={1}
            mb="sm"
          />
          <Checkbox
            label={translations.captain}
            checked={players[selectedPlayerId]?.isCaptain || false}
            onChange={(e) => onPlayerChange(selectedPlayerId, 'isCaptain', e.target.checked)}
            mb="sm"
          />
          <Button onClick={onSave} variant="light" fullWidth>
            {translations.save}
          </Button>
        </div>
      )}
    </Modal>
  );
}