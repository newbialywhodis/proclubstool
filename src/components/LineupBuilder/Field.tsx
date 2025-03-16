import React from 'react';
import { Box, Badge, Paper, Text } from '@mantine/core';
import SoccerJersey from 'soccer-jersey';

// Definicja typu dozwolonych stylów koszulki
export type JerseyStyle =
  | "plain"
  | "striped"
  | "dashed"
  | "two-color"
  | "striped-thin"
  | "striped-thick"
  | "waves"
  | "checkered"
  | "hoops"
  | "single-band";

// Typ opcji customizacji koszulki
export type JerseyOptions = {
  shirtColor: string;
  sleeveColor: string;
  textColor: string;
  shirtStyle: JerseyStyle;
};

export type PlayerData = {
  name: string;
  number: number;
  isCaptain: boolean;
};

export type PlayerPosition = {
  id: string;
  label: string;
  x: number; // pozycja pozioma w %
  y: number; // pozycja pionowa w %
};

interface FieldProps {
  formation: string;
  players: Record<string, PlayerData>;
  formationsData: Record<string, PlayerPosition[]>;
  jerseyOptions: JerseyOptions;
  badgeColor: string;
}

export function Field({
  formation,
  players,
  formationsData,
  jerseyOptions,
  badgeColor,
}: FieldProps) {
  if (!formation) return null;

  const fieldStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '0',
    paddingBottom: '100%',
    backgroundImage: 'url(/src/assets/field.png)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const getJerseyImage = (player: PlayerData) => {
    return SoccerJersey.draw({
      shirtText: player.number.toString(),
      shirtColor: jerseyOptions.shirtColor,
      sleeveColor: jerseyOptions.sleeveColor,
      shirtStyle: jerseyOptions.shirtStyle,
      textColor: jerseyOptions.textColor,
      isBack: true,
    });
  };

  return (
    <Box style={fieldStyle}>
      {formationsData[formation].map((player) => {
        const data = players[player.id];
        return (
          <div
            key={player.id}
            style={{
              position: 'absolute',
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Paper p="xs" ta="center" withBorder>
              {data ? (
                <>
                  <img
                    crossOrigin="anonymous"
                    src={getJerseyImage(data)}
                    alt={`${data.name} jersey`}
                    width="60"
                  />
                  <Text size="sm" fw={500}>
                    {data.name} {data.isCaptain && '(C)'}
                  </Text>
                </>
              ) : (
                <Text>Brak danych</Text>
              )}
              <Badge color={badgeColor} variant="filled">
                {player.label}
              </Badge>
            </Paper>
          </div>
        );
      })}
    </Box>
  );
}