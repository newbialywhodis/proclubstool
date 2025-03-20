import { useEffect, useState } from "react";
import { 
  Title, 
  Table, 
  Container, 
  Loader, 
  Alert,
  ScrollArea,
  Text,
  Paper,
  Group,
  Badge,
  ThemeIcon,
  Tooltip,
  Grid,
  Image
} from "@mantine/core";
import { 
  IconTrophy, 
  IconSoccerField, 
  IconCircleCheck, 
  IconEqual, 
  IconX
} from '@tabler/icons-react';

interface Team {
  team_name: string;
  team_abbr: string;
  team_slug: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  score_for: number;
  score_against: number;
  team_logo: string;
}

export function Page2() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.virtualprogaming.com/public/leagues/PTL/most-points/?limit=1000&offset=0", {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setTeams(data.data);
        } else {
          throw new Error("Unexpected data format");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const mostLossesTeam = teams.reduce((prev, curr) => (prev.losses > curr.losses ? prev : curr), teams[0]);
  const mostWinsTeam = teams.reduce((prev, curr) => (prev.wins > curr.wins ? prev : curr), teams[0]);
  const mostGoalsTeam = teams.reduce((prev, curr) => (prev.score_for > curr.score_for ? prev : curr), teams[0]);
  const mostConcededTeam = teams.reduce((prev, curr) => (prev.score_against > curr.score_against ? prev : curr), teams[0]);
  const mostDrawsTeam = teams.reduce((prev, curr) => (prev.draws > curr.draws ? prev : curr), teams[0]);

  const rows = teams.map((team, index) => (
    <Table.Tr key={team.team_slug}>
      <Table.Td>
        <Group gap="xs">
        <Text>{index + 1}</Text>
          {index === 0 && <ThemeIcon color="yellow" variant="light"><IconTrophy size={16} /></ThemeIcon>}
          {index === 1 && <ThemeIcon color="gray" variant="light"><IconTrophy size={16} /></ThemeIcon>}
          {index === 2 && <ThemeIcon color="orange" variant="light"><IconTrophy size={16} /></ThemeIcon>}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Image
            src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${team.team_logo}/xlThumb`}
            alt={`${team.team_name} logo`}
            width={30}
            height={30}
            radius="sm"
            fallbackSrc="https://via.placeholder.com/30?text=Logo" // Zapasowy obrazek w razie błędu
          />
          <Text fw={500}>{team.team_name}</Text>
          <Badge variant="light" color="gray">{team.team_abbr}</Badge>
        </Group>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" size="lg">{team.points}</Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconSoccerField size={16} color="gray" />
          <Text>{team.played}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconCircleCheck size={16} color="green" />
          <Text>{team.wins}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconEqual size={16} color="gray" />
          <Text>{team.draws}</Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Group gap={4}>
          <IconX size={16} color="red" />
          <Text>{team.losses}</Text>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container fluid py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={1}>Tabela Ligowa</Title>
        <Badge color="gray" size="lg" variant="outline">Sezon 2024/2025</Badge>
      </Group>

      {loading && (
        <Group justify="center" py="xl">
          <Loader size="lg" type="dots" />
        </Group>
      )}
      
      {error && (
        <Alert 
          color="red" 
          title="Błąd" 
          mb="lg" 
          icon={<IconX size={20} />}
          variant="outline"
        >
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        teams.length > 0 ? (
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper radius="md" withBorder p="md" style={{ height: '100%' }}>
                <ScrollArea h={600}>
                  <Table 
                    verticalSpacing="md"
                    horizontalSpacing="lg"
                    striped="even"
                    highlightOnHover
                    withTableBorder={false}
                    withColumnBorders={false}
                    style={{ width: '100%' }}
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ width: '15%' }}>Poz.</Table.Th>
                        <Table.Th style={{ width: '35%' }}>Drużyna</Table.Th>
                        <Table.Th style={{ width: '10%' }}>
                          <Tooltip label="Punkty">
                            <Text style={{ cursor: "pointer" }}>Pkt</Text>
                          </Tooltip>
                        </Table.Th>
                        <Table.Th style={{ width: '10%' }}>
                          <Tooltip label="Mecze rozegrane">
                            <Text style={{ cursor: "pointer" }}>M</Text>
                          </Tooltip>
                        </Table.Th>
                        <Table.Th style={{ width: '10%' }}>
                          <Tooltip label="Wygrane">
                            <Text style={{ cursor: "pointer" }}>W</Text>
                          </Tooltip>
                        </Table.Th>
                        <Table.Th style={{ width: '10%' }}>
                          <Tooltip label="Remisy">
                            <Text style={{ cursor: "pointer" }}>R</Text>
                          </Tooltip>
                        </Table.Th>
                        <Table.Th style={{ width: '10%' }}>
                          <Tooltip label="Przegrane">
                            <Text style={{ cursor: "pointer" }}>P</Text>
                          </Tooltip>
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper radius="md" withBorder p="md" style={{ height: '100%' }}>
                <Title order={2} size="h3" mb="md">Ciekawostki</Title>
                <Text mb="sm">
                  - Drużyna, która przegrała najwięcej meczów to{" "}
                  <Text span fw={700}>{mostLossesTeam?.team_name}</Text> z{" "}
                  <Text span fw={700}>{mostLossesTeam?.losses}</Text> porażkami.
                </Text>
                <Text mb="sm">
                  - Drużyna z największą liczbą wygranych to{" "}
                  <Text span fw={700}>{mostWinsTeam?.team_name}</Text> z{" "}
                  <Text span fw={700}>{mostWinsTeam?.wins}</Text> zwycięstwami.
                </Text>
                <Text mb="sm">
                  - Najwięcej goli strzeliła drużyna{" "}
                  <Text span fw={700}>{mostGoalsTeam?.team_name}</Text> –{" "}
                  <Text span fw={700}>{mostGoalsTeam?.score_for}</Text>.
                </Text>
                <Text mb="sm">
                  - Drużyna, która straciła najwięcej goli to{" "}
                  <Text span fw={700}>{mostConcededTeam?.team_name}</Text> –{" "}
                  <Text span fw={700}>{mostConcededTeam?.score_against}</Text>.
                </Text>
                <Text>
                  - Najwięcej remisów zanotowała drużyna{" "}
                  <Text span fw={700}>{mostDrawsTeam?.team_name}</Text> –{" "}
                  <Text span fw={700}>{mostDrawsTeam?.draws}</Text>.
                </Text>
              </Paper>
            </Grid.Col>
          </Grid>
        ) : (
          <Paper p="xl" withBorder radius="md">
            <Text c="gray" ta="center" size="lg">Brak danych do wyświetlenia</Text>
          </Paper>
        )
      )}
    </Container>
  );
}