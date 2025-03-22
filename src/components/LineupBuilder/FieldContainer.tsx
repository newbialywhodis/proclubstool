import React, { Ref } from 'react';
import { Field, PlayerData, JerseyOptions } from './Field';

interface FieldContainerProps {
  formation: string;
  players: Record<string, PlayerData>;
  formationsData: Record<string, any>;
  jerseyOptions: JerseyOptions;
  badgeColor: string;
  currentFieldIndex: number;
  paperRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customBackground: string | null;
  fieldScale: number;
  backgroundPositionX: number;
  backgroundPositionY: number;
  fieldPositionY: number;
  onPlayerClick: (playerId: string) => void;
  fieldRef: Ref<HTMLDivElement>;
}

export function FieldContainer({
  formation,
  players,
  formationsData,
  jerseyOptions,
  badgeColor,
  currentFieldIndex,
  paperRadius,
  customBackground,
  fieldScale,
  backgroundPositionX,
  backgroundPositionY,
  fieldPositionY,
  onPlayerClick,
  fieldRef,
}: FieldContainerProps) {
  return (
    <Field
      ref={fieldRef}
      formation={formation}
      players={players}
      formationsData={formationsData}
      jerseyOptions={jerseyOptions}
      badgeColor={badgeColor}
      onPlayerClick={onPlayerClick}
      currentFieldIndex={currentFieldIndex}
      paperRadius={paperRadius}
      customBackground={customBackground}
      fieldScale={fieldScale}
      backgroundPositionX={backgroundPositionX}
      backgroundPositionY={backgroundPositionY}
      fieldPositionY={fieldPositionY}
    />
  );
}