import { useState, useRef } from 'react';
import {
  Select,
  TextInput,
  Grid,
  Title,
  Group,
  Paper,
  Slider,
  Checkbox,
  NumberInput,
  Flex,
  Button,
  ActionIcon,
  Menu,
  ColorInput,
  ThemeIcon,
  Text,
  Divider,
  Modal,
  Tabs,
  Table,
} from '@mantine/core';
import { IconSettings, IconFileDownload, IconUsers, IconLayout, IconShirt, IconMapPin, IconSoccerField } from '@tabler/icons-react';
import { formationsData } from './formationsData';
import { Field, PlayerData, JerseyOptions, JerseyStyle } from './Field';
import * as htmlToImage from 'html-to-image';
import { useOutletContext } from 'react-router-dom';

interface ContextType {
  language: 'pl' | 'en';
  setLanguage: (lang: 'pl' | 'en') => void;
  translations: Record<string, string>;
}

function initPlayersForFormation(formation: string): Record<string, PlayerData> {
  const newPlayers: Record<string, PlayerData> = {};
  formationsData[formation].forEach((player) => {
    newPlayers[player.id] = { name: '', number: 1, isCaptain: false };
  });
  return newPlayers;
}

export function LineupBuilder() {
  const { translations } = useOutletContext<ContextType>();
  const defaultFormation = '3-5-2';
  const [formation, setFormation] = useState<string | null>(defaultFormation);
  const [players, setPlayers] = useState<Record<string, PlayerData>>(
    initPlayersForFormation(defaultFormation)
  );
  const [jerseyOptions, setJerseyOptions] = useState<JerseyOptions>({
    shirtColor: '#007bff',
    sleeveColor: '#ffffff',
    textColor: '#ffffff',
    shirtStyle: 'plain',
    shirtStyleColor: '#ffffff',
  });
  const [badgeColor, setBadgeColor] = useState('#007bff');
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [paperRadius, setPaperRadius] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('sm');
  const fieldRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPlayerModal = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setModalOpened(true);
  };

  const handleFormationChange = (value: string | null) => {
    if (value) {
      setFormation(value);
      setPlayers(initPlayersForFormation(value));
    }
  };

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

  const savePlayerData = () => {
    setModalOpened(false);
    setSelectedPlayerId(null);
  };

  const exportAsImage = async () => {
    if (fieldRef.current) {
      try {
        const node = fieldRef.current;
        const rect = node.getBoundingClientRect();
        const dataUrl = await htmlToImage.toPng(node, {
          width: rect.width,
          height: rect.height,
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'lineup.png';
        link.click();
      } catch (err) {
        console.error('Error generating image:', err);
        alert(translations['Wystąpił błąd przy generowaniu obrazu'] || 'Error generating image');
      }
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

  const handleImportFromJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          alert(translations['Imported file does not contain required data'] || 'Imported file does not contain required data');
        }
      } catch (error) {
        console.error('Import error:', error);
        alert(translations['Failed to import file'] || 'Failed to import file. Check JSON format.');
      } finally {
        event.target.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleField = () => {
    setCurrentFieldIndex((prev) => (prev + 1) % 2);
  };

  return (
    <div>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportFromJSON}
      />
      {formation && (
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Tabs defaultValue="customization">
                <Tabs.List grow>
                  <Tabs.Tab value="customization" leftSection={<IconSettings size={14} />}>
                    {translations.customization}
                  </Tabs.Tab>
                  <Tabs.Tab value="players" leftSection={<IconUsers size={14} />}>
                    {translations.players}
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="customization" pt="xs">
                  <Group gap="xs">
                    <ThemeIcon variant="light" size="sm">
                      <IconLayout />
                    </ThemeIcon>
                    <Title order={3}>{translations.formation}</Title>
                  </Group>
                  <Select
                    label={translations.selectFormation}
                    placeholder={translations.selectFormation}
                    value={formation}
                    onChange={handleFormationChange}
                    data={Object.keys(formationsData)}
                    mb="md"
                  />
                  <Divider my="sm" />
                  <Group gap="xs">
                    <ThemeIcon variant="light" size="sm">
                      <IconMapPin />
                    </ThemeIcon>
                    <Title order={3}>{translations.positions}</Title>
                  </Group>
                  <ColorInput
                    label={translations.badgeColor}
                    format="hex"
                    value={badgeColor}
                    onChange={setBadgeColor}
                    mb="md"
                  />
                  <Slider
                    label="Zaokrąglenie"
                    value={['xs', 'sm', 'md', 'lg', 'xl'].indexOf(paperRadius)}
                    onChange={(value) => setPaperRadius(['xs', 'sm', 'md', 'lg', 'xl'][value] as 'xs' | 'sm' | 'md' | 'lg' | 'xl')}
                    min={0}
                    max={4}
                    step={1}
                    marks={[
                      { value: 0, label: 'XS' },
                      { value: 1, label: 'SM' },
                      { value: 2, label: 'MD' },
                      { value: 3, label: 'LG' },
                      { value: 4, label: 'XL' },
                    ]}
                    mb="xl"
                  />
                  <Divider my="sm" />
                  <Group gap="xs">
                    <ThemeIcon variant="light" size="sm">
                      <IconShirt />
                    </ThemeIcon>
                    <Title order={3}>{translations.jersey}</Title>
                  </Group>
                  <ColorInput
                    label={translations.shirtColor}
                    format="hex"
                    value={jerseyOptions.shirtColor}
                    onChange={(value) =>
                      setJerseyOptions({ ...jerseyOptions, shirtColor: value })
                    }
                    mb="sm"
                  />
                  <ColorInput
                    label={translations.sleeveColor}
                    format="hex"
                    value={jerseyOptions.sleeveColor}
                    onChange={(value) =>
                      setJerseyOptions({ ...jerseyOptions, sleeveColor: value })
                    }
                    mb="sm"
                  />
                  <ColorInput
                    label={translations.styleColor}
                    format="hex"
                    value={jerseyOptions.shirtStyleColor}
                    onChange={(value) =>
                      setJerseyOptions({ ...jerseyOptions, shirtStyleColor: value })
                    }
                    mb="sm"
                  />
                  <ColorInput
                    label={translations.textColor}
                    format="hex"
                    value={jerseyOptions.textColor}
                    onChange={(value) =>
                      setJerseyOptions({ ...jerseyOptions, textColor: value })
                    }
                    mb="sm"
                  />
                  <Select
                    label={translations.shirtStyle}
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
                </Tabs.Panel>

                <Tabs.Panel value="players" pt="xs">
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>{translations.surname}</Table.Th>
                        <Table.Th>{translations.number}</Table.Th>
                        <Table.Th>{translations.captain}</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {Object.entries(players).map(([id, player]) => (
                        <Table.Tr key={id}>
                          <Table.Td>
                            <TextInput
                              value={player.name}
                              onChange={(e) => handlePlayerChange(id, 'name', e.target.value)}
                            />
                          </Table.Td>
                          <Table.Td>
                            <NumberInput
                              value={player.number}
                              onChange={(value) => handlePlayerChange(id, 'number', value || 1)}
                              min={1}
                              max={99}
                            />
                          </Table.Td>
                          <Table.Td>
                            <Checkbox
                              checked={player.isCaptain}
                              onChange={(e) => handlePlayerChange(id, 'isCaptain', e.target.checked)}
                            />
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Tabs.Panel>
              </Tabs>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6.0 }}>
            <Field
              ref={fieldRef}
              formation={formation}
              players={players}
              formationsData={formationsData}
              jerseyOptions={jerseyOptions}
              badgeColor={badgeColor}
              onPlayerClick={openPlayerModal}
              currentFieldIndex={currentFieldIndex}
              paperRadius={paperRadius}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper shadow="xs" p="md" withBorder>
              <Flex direction="column" gap="md">
                <Button
                  onClick={toggleField}
                  variant="light"
                  size="md"
                  leftSection={<IconSoccerField size={24} />}
                >
                  Zmień murawę
                </Button>
                <Flex direction="row" gap="sm" align="center" justify="space-between">
                  <Button
                    onClick={exportAsImage}
                    leftSection={<IconFileDownload size={24} />}
                    variant="light"
                    size="md"
                    style={{ flexGrow: 1 }}
                  >
                    {translations.exportImage}
                  </Button>
                  <Menu shadow="md">
                    <Menu.Target>
                      <ActionIcon size="lg" variant="light">
                        <IconSettings size={24} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={exportAsJSON}>
                        {translations.exportJSON}
                      </Menu.Item>
                      <Menu.Item onClick={triggerFileSelect}>
                        {translations.importJSON}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Flex>
              </Flex>
            </Paper>
          </Grid.Col>
        </Grid>
      )}

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={translations.editPlayer}
        centered
      >
        {selectedPlayerId && (
          <div>
            <TextInput
              label={translations.surname}
              value={players[selectedPlayerId]?.name || ''}
              onChange={(e) =>
                handlePlayerChange(selectedPlayerId, 'name', e.target.value)
              }
              mb="sm"
            />
            <NumberInput
              label={translations.number}
              value={players[selectedPlayerId]?.number || 1}
              onChange={(value) =>
                handlePlayerChange(selectedPlayerId, 'number', value || 1)
              }
              min={1}
              max={99}
              step={1}
              mb="sm"
            />
            <Checkbox
              label={translations.captain}
              checked={players[selectedPlayerId]?.isCaptain || false}
              onChange={(e) =>
                handlePlayerChange(selectedPlayerId, 'isCaptain', e.target.checked)
              }
              mb="sm"
            />
            <Button onClick={savePlayerData} variant="light" fullWidth>
              {translations.save}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}