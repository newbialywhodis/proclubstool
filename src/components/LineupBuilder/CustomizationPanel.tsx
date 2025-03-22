import React from 'react';
import {
  Tabs,
  Select,
  ColorInput,
  Slider,
  Group,
  Title,
  ThemeIcon,
  Divider,
  Table,
  TextInput,
  NumberInput,
  Checkbox,
} from '@mantine/core';
import { IconSettings, IconUsers, IconLayout, IconMapPin, IconShirt } from '@tabler/icons-react';
import { Paper } from '@mantine/core';
import { PlayerData, JerseyOptions, JerseyStyle } from './Field';

interface CustomizationPanelProps {
  translations: Record<string, string>;
  formation: string | null;
  players: Record<string, PlayerData>;
  jerseyOptions: JerseyOptions;
  badgeColor: string;
  paperRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  formationsData: Record<string, any>;
  onFormationChange: (value: string | null) => void;
  onPlayerChange: (id: string, field: keyof PlayerData, value: string | boolean | number) => void;
  onJerseyOptionsChange: (options: JerseyOptions) => void;
  onBadgeColorChange: (color: string) => void;
  onPaperRadiusChange: (radius: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => void;
}

export function CustomizationPanel({
  translations,
  formation,
  players,
  jerseyOptions,
  badgeColor,
  paperRadius,
  formationsData,
  onFormationChange,
  onPlayerChange,
  onJerseyOptionsChange,
  onBadgeColorChange,
  onPaperRadiusChange,
}: CustomizationPanelProps) {
  return (
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
            onChange={onFormationChange}
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
            onChange={onBadgeColorChange}
            mb="md"
          />
          <Slider
            label="Zaokrąglenie"
            value={['xs', 'sm', 'md', 'lg', 'xl'].indexOf(paperRadius)}
            onChange={(value) => onPaperRadiusChange(['xs', 'sm', 'md', 'lg', 'xl'][value] as 'xs' | 'sm' | 'md' | 'lg' | 'xl')}
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
            onChange={(value) => onJerseyOptionsChange({ ...jerseyOptions, shirtColor: value })}
            mb="sm"
          />
          <ColorInput
            label={translations.sleeveColor}
            format="hex"
            value={jerseyOptions.sleeveColor}
            onChange={(value) => onJerseyOptionsChange({ ...jerseyOptions, sleeveColor: value })}
            mb="sm"
          />
          <ColorInput
            label={translations.styleColor}
            format="hex"
            value={jerseyOptions.shirtStyleColor}
            onChange={(value) => onJerseyOptionsChange({ ...jerseyOptions, shirtStyleColor: value })}
            mb="sm"
          />
          <ColorInput
            label={translations.textColor}
            format="hex"
            value={jerseyOptions.textColor}
            onChange={(value) => onJerseyOptionsChange({ ...jerseyOptions, textColor: value })}
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
              onJerseyOptionsChange({ ...jerseyOptions, shirtStyle: value as JerseyStyle })
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
                      onChange={(e) => onPlayerChange(id, 'name', e.target.value)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      value={player.number}
                      onChange={(value) => onPlayerChange(id, 'number', value || 1)}
                      min={1}
                      max={99}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Checkbox
                      checked={player.isCaptain}
                      onChange={(e) => onPlayerChange(id, 'isCaptain', e.target.checked)}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}