import { useState, useEffect, useRef } from 'react';
import {
  MantineProvider,
  Select,
  TextInput,
  Grid,
  Title,
  Container,
  Paper,
  Badge,
  Checkbox,
  NumberInput,
  Flex,
  Button,
  ActionIcon,
  Menu,
  ColorInput,
} from '@mantine/core';
import { IconSettings, IconFileDownload, IconUpload } from '@tabler/icons-react';
import { formationsData } from './formationsData';
import { Field, PlayerData, JerseyOptions, JerseyStyle } from './Field';
import * as htmlToImage from 'html-to-image';

export function LineupBuilder() {
  const [formation, setFormation] = useState<string | null>('3-5-2');
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});
  const [jerseyOptions, setJerseyOptions] = useState<JerseyOptions>({
    shirtColor: '#007bff',
    sleeveColor: '#ffffff',
    textColor: '#ffffff',
    shirtStyle: 'plain',
  });
  const [badgeColor, setBadgeColor] = useState('#007bff');
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formation) {
      const newPlayers: Record<string, PlayerData> = {};
      formationsData[formation].forEach((player) => {
        newPlayers[player.id] = { name: '', number: 1, isCaptain: false };
      });
      setPlayers(newPlayers);
    }
  }, [formation]);

  const handlePlayerChange = (
    id: string,
    field: keyof PlayerData,
    value: string | boolean | number
  ) => {
    if (field === 'isCaptain' && value === true) {
      setPlayers((prev) => {
        const updatedPlayers = { ...prev };
        Object.keys(updatedPlayers).forEach((key) => {
          if (key !== id) {
            updatedPlayers[key].isCaptain = false;
          }
        });
        updatedPlayers[id].isCaptain = true;
        return updatedPlayers;
      });
    } else {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], [field]: value },
      }));
    }
  };

  const renderPlayerInputs = () => {
    if (!formation) return null;
    return (
      <Paper withBorder p="md">
        {formationsData[formation].map((player) => (
          <Grid key={player.id} align="center">
            <Grid.Col span={2}>
              <Badge variant="light">{player.label}</Badge>
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Nazwisko"
                placeholder="Nick gracza"
                value={players[player.id]?.name || ''}
                onChange={(e) =>
                  handlePlayerChange(player.id, 'name', e.target.value)
                }
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="Numer"
                placeholder="Wpisz numer"
                value={players[player.id]?.number || 1}
                onChange={(value) =>
                  handlePlayerChange(player.id, 'number', value || 1)
                }
                min={1}
                max={99}
                step={1}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Checkbox
                label="Kapitan"
                checked={players[player.id]?.isCaptain || false}
                onChange={(e) =>
                  handlePlayerChange(player.id, 'isCaptain', e.target.checked)
                }
              />
            </Grid.Col>
          </Grid>
        ))}
      </Paper>
    );
  };

  const exportAsImage = async () => {
    if (fieldRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(fieldRef.current);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'lineup.png';
        link.click();
      } catch (err) {
        console.error('Error generating image:', err);
        alert('An error occurred while generating the image.');
      }
    } else {
      console.error('Element "field" not found!');
    }
  };

  const exportAsJSON = () => {
    const data = JSON.stringify({ formation, players, jerseyOptions, badgeColor });
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lineup.json';
    link.click();
  };

  const importFromJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await file.text();
        const importedData = JSON.parse(fileContent);
        if (importedData.formation && importedData.players) {
          setFormation(importedData.formation);
          setPlayers(importedData.players);
          if (importedData.jerseyOptions) {
            setJerseyOptions(importedData.jerseyOptions);
          }
          if (importedData.badgeColor) {
            setBadgeColor(importedData.badgeColor);
          }
        } else {
          alert("Importowany plik nie zawiera wymaganych danych.");
        }
      } catch (error) {
        console.error("Błąd importu:", error);
        alert("Nie udało się zaimportować pliku. Sprawdź format JSON.");
      } finally {
        event.target.value = '';
      }
    }
  };

  return (
    <MantineProvider>
      <Container size="xl">
        <Title order={1} mb="lg">
          Kreator składu
        </Title>
        <Flex direction="row" justify="space-between" align="center" mb="lg">
          <Select
            label="Wybierz formację"
            placeholder="Wybierz formację"
            value={formation}
            onChange={setFormation}
            data={Object.keys(formationsData)}
          />

          <Flex align="center">
            <Button
              onClick={exportAsImage}
              leftSection={<IconFileDownload size={14} />}
              variant="light"
              style={{ marginRight: '8px' }}
            >
              Eksportuj
            </Button>

            <Menu shadow="md">
              <Menu.Target>
                <ActionIcon size="lg" variant="light">
                  <IconSettings size={24} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={exportAsJSON}>
                  Eksportuj skład
                </Menu.Item>
                <Menu.Item>
                  <label htmlFor="import-input" style={{ cursor: 'pointer' }}>
                    Importuj skład
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    id="import-input"
                    style={{ display: 'none' }}
                    onChange={importFromJSON}
                  />
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
        </Flex>

        {formation && (
          <Grid>
            <Grid.Col span={4}>
              {renderPlayerInputs()}

              {/* Panel customizacji koszulki */}
              <Paper withBorder p="md" mt="md">
                <Title order={4} mb="sm">
                  Customizacja koszulki
                </Title>
                <ColorInput
                  label="Kolor koszulki"
                  format="hex"
                  value={jerseyOptions.shirtColor}
                  onChange={(value) =>
                    setJerseyOptions({ ...jerseyOptions, shirtColor: value })
                  }
                  mb="sm"
                />
                <ColorInput
                  label="Kolor rękawa"
                  format="hex"
                  value={jerseyOptions.sleeveColor}
                  onChange={(value) =>
                    setJerseyOptions({ ...jerseyOptions, sleeveColor: value })
                  }
                  mb="sm"
                />
                <ColorInput
                  label="Kolor numeru"
                  format="hex"
                  value={jerseyOptions.textColor}
                  onChange={(value) =>
                    setJerseyOptions({ ...jerseyOptions, textColor: value })
                  }
                  mb="sm"
                />
                <Select
                  label="Styl koszulki"
                  data={[
                    'plain',
                    'striped',
                    'dashed',
                    'two-color',
                    'striped-thin',
                    'striped-thick',
                    'waves',
                    'checkered',
                    'hoops',
                    'single-band',
                  ]}
                  value={jerseyOptions.shirtStyle}
                  onChange={(value) =>
                    setJerseyOptions({
                      ...jerseyOptions,
                      shirtStyle: value as JerseyStyle,
                    })
                  }
                />
              </Paper>

              <Paper withBorder p="md" mt="md">
                <Title order={4} mb="sm">
                  Pozycja zawodników
                </Title>
                <ColorInput
                  label="Kolor badge"
                  format="hex"
                  value={badgeColor}
                  onChange={setBadgeColor}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={8} ref={fieldRef}>
              <Field
                formation={formation}
                players={players}
                formationsData={formationsData}
                jerseyOptions={jerseyOptions}
                badgeColor={badgeColor}
              />
            </Grid.Col>
          </Grid>
        )}
      </Container>
    </MantineProvider>
  );
}