import React from 'react';
import { Paper, Flex, Button, ActionIcon, Menu, Slider, Text, Divider } from '@mantine/core';
import { IconSoccerField, IconUpload, IconTrash, IconFileDownload, IconSettings } from '@tabler/icons-react';

interface ActionPanelProps {
  translations: Record<string, string>;
  customBackground: string | null;
  fieldScale: number;
  backgroundPositionX: number;
  backgroundPositionY: number;
  fieldPositionY: number;
  onToggleField: () => void;
  onBackgroundUploadClick: () => void;
  onRemoveBackground: () => void;
  onExportImage: () => void;
  onExportJSON: () => void;
  onImportJSONClick: () => void;
  onResetConfig: () => void;
  onFieldScaleChange: (scale: number) => void;
  onBackgroundPositionXChange: (position: number) => void;
  onBackgroundPositionYChange: (position: number) => void;
  onFieldPositionYChange: (position: number) => void;
}

export function ActionPanel({
  translations,
  customBackground,
  fieldScale,
  backgroundPositionX,
  backgroundPositionY,
  fieldPositionY,
  onToggleField,
  onBackgroundUploadClick,
  onRemoveBackground,
  onExportImage,
  onExportJSON,
  onImportJSONClick,
  onResetConfig,
  onFieldScaleChange,
  onBackgroundPositionXChange,
  onBackgroundPositionYChange,
  onFieldPositionYChange,
}: ActionPanelProps) {
  return (
    <Paper shadow="xs" p="sm" withBorder>
      <Flex direction="column" gap="sm">
        <Button
          onClick={onToggleField}
          variant="light"
          size="sm"
          leftSection={<IconSoccerField size={20} />}
        >
          Zmień murawę
        </Button>
        <Button
          onClick={onBackgroundUploadClick}
          variant="light"
          size="sm"
          leftSection={<IconUpload size={20} />}
        >
          Wgraj tło za boiskiem
        </Button>
        {customBackground && (
          <>
            <Button
              onClick={onRemoveBackground}
              variant="light"
              color="red"
              size="sm"
              leftSection={<IconTrash size={20} />}
            >
              Usuń tło za boiskiem
            </Button>
            <Text size="sm" fw={500}>Pozycja tła X</Text>
            <Slider
              value={backgroundPositionX}
              onChange={onBackgroundPositionXChange}
              min={0}
              max={100}
              step={1}
              marks={[
                { value: 0, label: 'Lewo' },
                { value: 50, label: 'Środek' },
                { value: 100, label: 'Prawo' },
              ]}
              mb="sm"
            />
            <Text size="sm" fw={500}>Pozycja tła Y</Text>
            <Slider
              value={backgroundPositionY}
              onChange={onBackgroundPositionYChange}
              min={0}
              max={100}
              step={1}
              marks={[
                { value: 0, label: 'Góra' },
                { value: 50, label: 'Środek' },
                { value: 100, label: 'Dół' },
              ]}
              mb="sm"
            />
            <Divider my="sm" />
          </>
        )}
        <Text size="sm" fw={500}>Pozycja boiska Y</Text>
        <Slider
          value={fieldPositionY}
          onChange={onFieldPositionYChange}
          min={-10}
          max={10}
          step={1}
          marks={[
            { value: -10, label: 'Góra' },
            { value: 0, label: 'Środek' },
            { value: 10, label: 'Dół' },
          ]}
          mb="sm"
        />
        <Text size="sm" fw={500}>Skala boiska</Text>
        <Slider
          value={fieldScale}
          onChange={onFieldScaleChange}
          min={0.5}
          max={1.0}
          step={0.05}
          marks={[
            { value: 0.5, label: '50%' },
            { value: 0.75, label: '75%' },
            { value: 1.0, label: '100%' },
          ]}
          mb="sm"
        />
        <Flex direction="row" gap="sm" align="center" justify="space-between">
          <Button
            onClick={onExportImage}
            leftSection={<IconFileDownload size={20} />}
            variant="light"
            size="sm"
            style={{ flexGrow: 1 }}
          >
            {translations.exportImage}
          </Button>
          <Menu shadow="md">
            <Menu.Target>
              <ActionIcon size="md" variant="light">
                <IconSettings size={20} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={onExportJSON}>{translations.exportJSON}</Menu.Item>
              <Menu.Item onClick={onImportJSONClick}>{translations.importJSON}</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
        <Button
          onClick={onResetConfig}
          variant="light"
          color="red"
          size="sm"
          leftSection={<IconTrash size={20} />}
        >
          Resetuj konfigurację
        </Button>
      </Flex>
    </Paper>
  );
}