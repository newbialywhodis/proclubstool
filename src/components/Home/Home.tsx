import React from "react";
import { Container, Title, Text, Button, Group, Stack, Card, Image, Badge } from "@mantine/core";
import { IconDownload, IconUsers, IconVideo } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Stack align="center" gap="md" mb="xl">
        <Title order={1} ta="center" fw={700}>
          Stwórz i Eksportuj Skład Swojej Drużyny
        </Title>
        <Text size="lg" c="gray" ta="center" maw={800}>
          Zbuduj wymarzoną drużynę w naszym kreatorze, dostosuj ją dzięki wielu opcjom i wyeksportuj jako PNG. Oglądaj rozgrywki VirtualProGaming w nowej, lepszej jakości!
        </Text>
      </Stack>

      <Group justify="center" grow mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder maw={400}>
          <Card.Section>
            <Image
              src="/assets/lineupmaker_preview.png"
              height={200}
              alt="Kreator składu drużyny - eksport PNG"
              radius="md"
            />
          </Card.Section>
          <Stack mt="md" gap="sm">
            <Title order={3} fw={600}>Kreator Składu</Title>
            <Text size="sm" c="gray">
              Dostosuj swoją drużynę z mnóstwem opcji: wybierz zawodników, ustawienia taktyczne i kolory. Eksportuj gotowy skład jako PNG w kilka sekund!
            </Text>
            <Button 
              variant="filled" 
              color="blue" 
              leftSection={<IconUsers size={16} />}
              onClick={() => navigate('/lineupbuilder')}
            >
              Rozpocznij Tworzenie
            </Button>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder maw={400}>
          <Card.Section>
            <Image
              src="/assets/league_preview.png"
              height={200}
              alt="Podgląd rozgrywek VirtualProGaming"
              radius="md"
            />
          </Card.Section>
          <Stack mt="md" gap="sm">
            <Title order={3} fw={600}>Rozgrywki VPG</Title>
            <Text size="sm" c="gray">
              Oglądaj mecze VirtualProGaming w nowej, ulepszonej jakości. Śledź swoje drużyny i ciesz się profesjonalnym podglądem rozgrywek!
            </Text>
            <Button 
              variant="filled" 
              color="green" 
              leftSection={<IconVideo size={16} />}
              onClick={() => navigate('/competitions')}
            >
              Zobacz Rozgrywki
            </Button>
          </Stack>
        </Card>
      </Group>

      <Stack align="center" gap="lg" mb="xl">
        <Badge color="blue" size="lg" variant="light">
          Mnóstwo opcji dostosowania
        </Badge>
        <Text size="md" c="gray" ta="center" maw={600}>
          Nasz kreator oferuje szeroką gamę ustawień – od wyboru zawodników, przez taktyki, aż po personalizację wizualną. Stwórz unikalny skład i podziel się nim ze światem!
        </Text>
      </Stack>

      <Group justify="center">
        <Button 
          size="lg" 
          variant="gradient" 
          gradient={{ from: 'blue', to: 'cyan' }} 
          leftSection={<IconDownload size={20} />}
          onClick={() => navigate('/lineupbuilder')}
        >
          Wyeksportuj Swój Skład Teraz
        </Button>
      </Group>
    </Container>
  );
}