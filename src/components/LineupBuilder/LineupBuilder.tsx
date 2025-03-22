import { useState, useRef, useEffect } from 'react';
import { Grid, Flex, Box } from '@mantine/core';
import { formationsData } from './formationsData';
import { PlayerData, JerseyOptions } from './Field';
import * as htmlToImage from 'html-to-image';
import { useOutletContext } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CustomizationPanel } from './CustomizationPanel';
import { ActionPanel } from './ActionPanel';
import { FieldContainer } from './FieldContainer';
import { PlayerModal } from './PlayerModal';

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

  const [formation, setFormation] = useState<string | null>(() =>
    Cookies.get('formation') || defaultFormation
  );
  const [players, setPlayers] = useState<Record<string, PlayerData>>(() =>
    Cookies.get('players') ? JSON.parse(Cookies.get('players')!) : initPlayersForFormation(defaultFormation)
  );
  const [jerseyOptions, setJerseyOptions] = useState<JerseyOptions>(() =>
    Cookies.get('jerseyOptions') ? JSON.parse(Cookies.get('jerseyOptions')!) : {
      shirtColor: '#007bff',
      sleeveColor: '#ffffff',
      textColor: '#ffffff',
      shirtStyle: 'plain',
      shirtStyleColor: '#ffffff',
    }
  );
  const [badgeColor, setBadgeColor] = useState(() => Cookies.get('badgeColor') || '#007bff');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [backgroundPositionX, setBackgroundPositionX] = useState<number>(50);
  const [backgroundPositionY, setBackgroundPositionY] = useState<number>(50);
  const [fieldPositionY, setFieldPositionY] = useState<number>(0);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [paperRadius, setPaperRadius] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('sm');
  const [fieldScale, setFieldScale] = useState<number>(0.8);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const fieldRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Cookies.set('formation', formation || defaultFormation, { expires: 365 });
    Cookies.set('players', JSON.stringify(players), { expires: 365 });
    Cookies.set('jerseyOptions', JSON.stringify(jerseyOptions), { expires: 365 });
    Cookies.set('badgeColor', badgeColor, { expires: 365 });
  }, [formation, players, jerseyOptions, badgeColor]);

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

  const resetConfig = () => {
    const defaultFormation = '3-5-2';
    setFormation(defaultFormation);
    setPlayers(initPlayersForFormation(defaultFormation));
    setJerseyOptions({
      shirtColor: '#007bff',
      sleeveColor: '#ffffff',
      textColor: '#ffffff',
      shirtStyle: 'plain',
      shirtStyleColor: '#ffffff',
    });
    setBadgeColor('#007bff');
    setCurrentFieldIndex(0);
    setPaperRadius('sm');
    setCustomBackground(null);
    setBackgroundPositionX(50);
    setBackgroundPositionY(50);
    setFieldPositionY(0); // Reset na 0
    setFieldScale(0.8);
    Cookies.remove('formation');
    Cookies.remove('players');
    Cookies.remove('jerseyOptions');
    Cookies.remove('badgeColor');
  };

  const openPlayerModal = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setModalOpened(true);
  };

  const closePlayerModal = () => {
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
    const data = JSON.stringify({
      formation,
      players,
      jerseyOptions,
      badgeColor,
      fieldScale,
      backgroundPositionX,
      backgroundPositionY,
      fieldPositionY,
    });
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
          if (importedData.jerseyOptions) setJerseyOptions(importedData.jerseyOptions);
          if (importedData.badgeColor) setBadgeColor(importedData.badgeColor);
          if (importedData.fieldScale) setFieldScale(importedData.fieldScale);
          if (importedData.backgroundPositionX) setBackgroundPositionX(importedData.backgroundPositionX);
          if (importedData.backgroundPositionY) setBackgroundPositionY(importedData.backgroundPositionY);
          if (importedData.fieldPositionY) setFieldPositionY(importedData.fieldPositionY);
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

  const triggerFileSelect = () => fileInputRef.current?.click();
  const handleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCustomBackground(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const toggleField = () => setCurrentFieldIndex((prev) => (prev + 1) % 2);

  return (
    <div>
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportFromJSON}
      />
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleBackgroundUpload}
        ref={backgroundInputRef}
      />
      {formation && (
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <CustomizationPanel
              translations={translations}
              formation={formation}
              players={players}
              jerseyOptions={jerseyOptions}
              badgeColor={badgeColor}
              paperRadius={paperRadius}
              formationsData={formationsData}
              onFormationChange={handleFormationChange}
              onPlayerChange={handlePlayerChange}
              onJerseyOptionsChange={setJerseyOptions}
              onBadgeColorChange={setBadgeColor}
              onPaperRadiusChange={setPaperRadius}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Flex direction={{ base: 'column', md: 'row' }} gap="md" align="flex-start" h="100%">
              <FieldContainer
                formation={formation}
                players={players}
                formationsData={formationsData}
                jerseyOptions={jerseyOptions}
                badgeColor={badgeColor}
                currentFieldIndex={currentFieldIndex}
                paperRadius={paperRadius}
                customBackground={customBackground}
                fieldScale={fieldScale}
                backgroundPositionX={backgroundPositionX}
                backgroundPositionY={backgroundPositionY}
                fieldPositionY={fieldPositionY}
                onPlayerClick={openPlayerModal}
                fieldRef={fieldRef}
              />
              <Box w={{ base: '100%', md: '250px' }}>
                <ActionPanel
                  translations={translations}
                  customBackground={customBackground}
                  fieldScale={fieldScale}
                  backgroundPositionX={backgroundPositionX}
                  backgroundPositionY={backgroundPositionY}
                  fieldPositionY={fieldPositionY}
                  onToggleField={toggleField}
                  onBackgroundUploadClick={() => backgroundInputRef.current?.click()}
                  onRemoveBackground={() => setCustomBackground(null)}
                  onExportImage={exportAsImage}
                  onExportJSON={exportAsJSON}
                  onImportJSONClick={triggerFileSelect}
                  onResetConfig={resetConfig}
                  onFieldScaleChange={setFieldScale}
                  onBackgroundPositionXChange={setBackgroundPositionX}
                  onBackgroundPositionYChange={setBackgroundPositionY}
                  onFieldPositionYChange={setFieldPositionY}
                />
              </Box>
            </Flex>
          </Grid.Col>
        </Grid>
      )}
      <PlayerModal
        translations={translations}
        opened={modalOpened}
        selectedPlayerId={selectedPlayerId}
        players={players}
        onClose={closePlayerModal}
        onPlayerChange={handlePlayerChange}
        onSave={closePlayerModal}
      />
    </div>
  );
}