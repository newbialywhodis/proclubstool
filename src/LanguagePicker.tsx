import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import classes from './LanguagePicker.module.css';

const images = {
  polish: '/assets/flags/pl.png',
  english: '/assets/flags/en.png',
};

const data = [
  { label: 'Polish', image: images.polish, value: 'pl' },
  { label: 'English', image: images.english, value: 'en' },
];

interface LanguagePickerProps {
  language: 'pl' | 'en';
  setLanguage: (lang: 'pl' | 'en') => void;
}

export function LanguagePicker({ language, setLanguage }: LanguagePickerProps) {
  const [opened, setOpened] = useState(false);
  const selected = data.find((item) => item.value === language) || data[0];

  const items = data.map((item) => (
    <Menu.Item
      leftSection={<Image src={item.image} width={18} height={18} />}
      onClick={() => setLanguage(item.value as 'pl' | 'en')}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
          <Group gap="xs">
            <Image src={selected.image} width={22} height={22} />
            <span className={classes.label}>{selected.label}</span>
          </Group>
          <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}