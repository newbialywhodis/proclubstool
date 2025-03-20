import React from 'react';
import { AspectRatio, Box, Badge, Paper, Text, Image, useMantineTheme, Indicator } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import SoccerJersey from 'soccer-jersey';

export type JerseyStyle =
  | 'plain'
  | 'striped'
  | 'dashed'
  | 'two-color'
  | 'striped-thin'
  | 'striped-thick'
  | 'waves'
  | 'checkered'
  | 'hoops'
  | 'single-band';

export type JerseyOptions = {
  shirtColor: string;
  sleeveColor: string;
  textColor: string;
  shirtStyle: JerseyStyle;
  shirtStyleColor: string;
};

export type PlayerData = {
  name: string;
  number: number;
  isCaptain: boolean;
};

export type PlayerPosition = {
  id: string;
  label: string;
  x: number;
  y: number;
};

interface FieldProps {
  formation: string;
  players: Record<string, PlayerData>;
  formationsData: Record<string, PlayerPosition[]>;
  jerseyOptions: JerseyOptions;
  badgeColor: string;
  onPlayerClick: (playerId: string) => void;
  currentFieldIndex: number;
  paperRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const fieldVariants = [
  '/assets/field.png',
  '/assets/field2.png'
];

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ formation, players, formationsData, jerseyOptions, badgeColor, onPlayerClick, currentFieldIndex, paperRadius }, ref) => {
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const markerWidth = isMobile ? '13%' : isTablet ? '14%' : '12%';

    const getJerseyImage = (player: PlayerData) => {
      return SoccerJersey.draw({
        shirtText: player.number.toString(),
        shirtColor: jerseyOptions.shirtColor,
        sleeveColor: jerseyOptions.sleeveColor,
        shirtStyle: jerseyOptions.shirtStyle,
        shirtStyleColor: jerseyOptions.shirtStyleColor,
        textColor: jerseyOptions.textColor,
        isBack: true,
      });
    };

    if (!formation || !formationsData[formation]) {
      return <Text>Invalid formation data</Text>;
    }

    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <AspectRatio ratio={1} w="100%">
          <Box
            ref={ref}
            style={{
              backgroundImage: `url(${fieldVariants[currentFieldIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            pos="relative"
            w="100%"
            h="100%"
          >
            {formationsData[formation].map((player) => {
              const data = players[player.id];
              return (
                <Box
                  key={player.id}
                  style={{
                    position: 'absolute',
                    left: `${player.x}%`,
                    top: `${player.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: markerWidth,
                    minWidth: isMobile ? '45px' : '60px',
                    cursor: 'pointer',
                  }}
                  onClick={() => onPlayerClick(player.id)}
                >
                  <Paper
                    p={isMobile ? '2px' : 'sm'}
                    ta="center"
                    radius={paperRadius}
                    shadow="md"
                    withBorder
                    w="100%"
                    style={{
                      overflow: 'visible',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'relative',
                    }}
                  >
                    {data && (
                      <Box style={{ position: 'relative', width: '100%' }}>
                        {data.isCaptain && (
                          <Indicator
                            label="C"
                            fw="bold"
                            color="yellow"
                            size={isMobile ? 12 : 16}
                            position="top-end"
                            offset={5}
                            style={{ zIndex: 2 }}
                          >
                            <Image
                              crossOrigin="anonymous"
                              src={getJerseyImage(data)}
                              alt={`${data.name} jersey`}
                              style={{
                                width: '100%',
                                maxWidth: isMobile ? '35px' : '60px',
                                margin: '0 auto',
                                zIndex: 1,
                              }}
                            />
                          </Indicator>
                        )}
                        {!data.isCaptain && (
                          <Image
                            crossOrigin="anonymous"
                            src={getJerseyImage(data)}
                            alt={`${data.name} jersey`}
                            style={{
                              width: '100%',
                              maxWidth: isMobile ? '35px' : '60px',
                              margin: '0 auto',
                            }}
                          />
                        )}
                        <Text size={isMobile ? '9px' : 'sm'} fw={500} truncate>
                          {data.name}
                        </Text>
                        <Badge
                          color={badgeColor}
                          autoContrast
                          variant="filled"
                          size={isMobile ? 'xs' : 'sm'}
                          mt="1px"
                        >
                          {player.label}
                        </Badge>
                      </Box>
                    )}
                    {!data && (
                      <Text size={isMobile ? '2xs' : 'sm'}>Brak danych</Text>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>
        </AspectRatio>
      </Box>
    );
  }
);

Field.displayName = 'Field';