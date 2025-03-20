import { useState, useEffect } from 'react';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Container,
  Text,
  ActionIcon,
  ThemeIcon,
} from '@mantine/core';
import {
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet } from 'react-router-dom';
import {
  IconBrandDiscordFilled,
  IconBrandInstagram,
  IconBrandYoutube,
  IconUsers,
  IconFileText,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import classes from './FooterLinks.module.css';
import logo from '/assets/logo.png';
import { LanguagePicker } from './LanguagePicker';
import { translations } from './translations';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });
  const [language, setLanguage] = useState<'pl' | 'en'>('pl');

  // Set initial language based on browser
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      setLanguage('en');
    } else {
      setLanguage('pl');
    }
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={(theme) => ({
        main: {
          borderColor:
            computedColorScheme === 'dark'
              ? theme.colors.dark[7]
              : undefined,
        },
        navbar: {
          backgroundColor:
            computedColorScheme === 'dark'
              ? theme.colors.dark[8]
              : undefined,
          borderColor:
            computedColorScheme === 'dark'
              ? theme.colors.dark[8]
              : undefined,
        },
        header: {
          backgroundColor:
            computedColorScheme === 'dark'
              ? theme.colors.dark[7]
              : undefined,
          borderColor:
            computedColorScheme === 'dark'
              ? theme.colors.dark[8]
              : undefined,
        },
      })}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <img src={logo} alt="Logo apki" style={{ height: '40px' }} />
          </Group>
          <Group gap="xs">
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === 'light' ? 'dark' : 'light'
                )
              }
              size="lg"
              variant="outline"
              aria-label="Toggle color scheme"
            >
              {computedColorScheme === 'light' ? (
                <IconMoon size={18} />
              ) : (
                <IconSun size={18} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar fw={'bold'} p="xs">
        <NavLink
          label={translations[language].appTitle}
          component={Link}
          to="/"
          onClick={toggle}
          active={location.pathname === '/'}
          leftSection={
            <ThemeIcon radius={'md'} size={'lg'} variant="light">
              <IconUsers size={16} />
            </ThemeIcon>
          }
          styles={{
            root: { borderRadius: '10px' },
            label: { fontSize: '14px' },
          }}
        />
        <NavLink
          label={translations[language].lineup}
          component={Link}
          to="/table"
          onClick={toggle}
          active={location.pathname === '/table'}
          leftSection={
            <ThemeIcon radius={'md'} size={'lg'} variant="light">
              <IconFileText size={16} />
            </ThemeIcon>
          }
          styles={{
            root: { borderRadius: '10px' },
            label: { fontSize: '14px' },
          }}
        />
        <Group p="xs">
          <LanguagePicker language={language} setLanguage={setLanguage} />
        </Group>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet
          context={{ language, setLanguage, translations: translations[language] }}
        />
        <footer className={classes.footer}>
          <Container py="md">
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap="xs" align="center">
                <img src={logo} alt="Logo apki" style={{ height: '30px' }} />
                <Text size="sm" c="dimmed">
                  © {new Date().getFullYear()} CLUBSPANEL APP
                </Text>
              </Group>
              <Group gap="xs" wrap="nowrap">
                <ActionIcon size="md" color="gray" variant="subtle">
                  <IconBrandDiscordFilled size={16} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="md" color="gray" variant="subtle">
                  <IconBrandInstagram size={16} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="md" color="gray" variant="subtle">
                  <IconBrandYoutube size={16} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Group>
          </Container>
        </footer>
      </AppShell.Main>
    </AppShell>
  );
}