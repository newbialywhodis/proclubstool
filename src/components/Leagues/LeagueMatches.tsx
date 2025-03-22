import { useState, useEffect } from "react";
import {
  Group,
  Loader,
  Text,
  Image,
  Badge,
  Grid,
  Paper,
  Select,
  Stack,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { IconTrophy, IconTargetArrow, IconX } from "@tabler/icons-react";

interface Match {
  id: number;
  datetime: string;
  status: string;
  home_name: string;
  home_logo?: string;
  home_score: number;
  away_name: string;
  away_logo?: string;
  away_score: number;
  match_day: number | null;
}

interface Team {
  name: string;
  logo?: string;
}

interface ApiResponse<T> {
  count: number;
  data: T[];
}

interface LeagueMatchesProps {
  leagueSlug: string;
  selectedSeason: string | null;
}

interface BiggestWinMatch extends Match {
  diff: number;
}

interface MostGoalsMatch extends Match {
  totalGoals: number;
}

export function LeagueMatches({ leagueSlug, selectedSeason }: LeagueMatchesProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const fetchMatches = async (season: string) => {
    setLoading(true);
    try {
      const [completedResponse, scheduledResponse] = await Promise.all([
        fetch(
          `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/matches/?status=complete&season=${season}&limit=50&offset=0`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY",
              Accept: "application/json",
            },
          }
        ),
        fetch(
          `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/matches/?status=scheduled&season=${season}&limit=50&offset=0`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ6NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY",
              Accept: "application/json",
            },
          }
        ),
      ]);

      if (!completedResponse.ok || !scheduledResponse.ok) {
        throw new Error("Failed to fetch matches");
      }

      const completedData: ApiResponse<Match> = await completedResponse.json();
      const scheduledData: ApiResponse<Match> = await scheduledResponse.json();
      const combinedMatches = [...completedData.data, ...scheduledData.data].sort(
        (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
      );
      setMatches(combinedMatches);
      setFilteredMatches(combinedMatches);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeason) {
      fetchMatches(selectedSeason);
    }
  }, [selectedSeason, leagueSlug]);

  const teamsMap = new Map<string, Team>();
  matches.forEach((match) => {
    if (match.home_name && !teamsMap.has(match.home_name)) {
      teamsMap.set(match.home_name, { name: match.home_name, logo: match.home_logo });
    }
    if (match.away_name && !teamsMap.has(match.away_name)) {
      teamsMap.set(match.away_name, { name: match.away_name, logo: match.away_logo });
    }
  });
  const teams = Array.from(teamsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (selectedTeam) {
      const filtered = matches.filter(
        (match) => match.home_name === selectedTeam || match.away_name === selectedTeam
      );
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(matches);
    }
  }, [selectedTeam, matches]);

  const completedMatches = matches.filter((m) => m.status === "complete");
  const drawPercentage =
    completedMatches.length > 0
      ? ((completedMatches.filter((m) => m.home_score === m.away_score).length /
          completedMatches.length) *
        100).toFixed(1)
      : "0.0";

  const biggestWinMatch = completedMatches.reduce<BiggestWinMatch>(
    (max, match) => {
      const diff = Math.abs(match.home_score - match.away_score);
      return diff > max.diff ? { ...match, diff } : max;
    },
    { ...completedMatches[0], diff: 0 } as BiggestWinMatch
  );

  const mostGoalsMatch = completedMatches.reduce<MostGoalsMatch>(
    (max, match) => {
      const totalGoals = match.home_score + match.away_score;
      return totalGoals > max.totalGoals ? { ...match, totalGoals } : max;
    },
    { ...completedMatches[0], totalGoals: 0 } as MostGoalsMatch
  );

  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const date = new Date(match.datetime).toLocaleDateString("pl-PL", { dateStyle: "medium" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const matchGroups = Object.entries(groupedMatches).map(([date, matches]) => {
    const matchCards = matches.map((match) => {
      let homeScoreColor: "dimmed" | undefined = undefined;
      let awayScoreColor: "dimmed" | undefined = undefined;

      if (match.status === "complete") {
        if (match.home_score === match.away_score) {
          homeScoreColor = "dimmed";
          awayScoreColor = "dimmed";
        } else if (match.home_score < match.away_score) {
          homeScoreColor = "dimmed";
        } else if (match.away_score < match.home_score) {
          awayScoreColor = "dimmed";
        }
      }

      return (
        <Grid.Col span={{ base: 12, sm: 6 }} key={match.id}>
          <Paper withBorder radius="sm" p="sm">
            <Group justify="space-between" align="center">
              <Group gap="md" align="center">
                <div>
                  <Group gap="xs" align="center" mb={8}>
                    {match.home_logo && (
                      <Image
                        src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${match.home_logo}/xlThumb`}
                        height={32}
                        width={32}
                        fit="contain"
                        alt={match.home_name}
                        radius="sm"
                        fallbackSrc="https://via.placeholder.com/32?text=Logo"
                      />
                    )}
                    <Text fw={500} size="md">
                      {match.home_name}
                    </Text>
                    {match.status === "complete" && (
                      <Text fw={700} size="lg" c={homeScoreColor}>
                        {match.home_score}
                      </Text>
                    )}
                  </Group>
                  <Group gap="xs" align="center">
                    {match.away_logo && (
                      <Image
                        src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${match.away_logo}/xlThumb`}
                        height={32}
                        width={32}
                        fit="contain"
                        alt={match.away_name}
                        radius="sm"
                        fallbackSrc="https://via.placeholder.com/32?text=Logo"
                      />
                    )}
                    <Text fw={500} size="md">
                      {match.away_name}
                    </Text>
                    {match.status === "complete" && (
                      <Text fw={700} size="lg" c={awayScoreColor}>
                        {match.away_score}
                      </Text>
                    )}
                  </Group>
                </div>
              </Group>
              <div style={{ textAlign: "right" }}>
                {match.status === "complete" && (
                  <Badge color="green" variant="light" mb={8} size="md">
                    KONIEC
                  </Badge>
                )}
                <Text c="dimmed" size="sm">
                  {new Date(match.datetime).toLocaleTimeString("pl-PL", { timeStyle: "short" })}
                </Text>
                {match.match_day && (
                  <Text c="gray" size="xs">
                    Kolejka {match.match_day}
                  </Text>
                )}
              </div>
            </Group>
          </Paper>
        </Grid.Col>
      );
    });

    return (
      <div key={date}>
        <Text fw={500} size="lg" mb="sm" mt="lg">
          {date}
        </Text>
        <Grid gutter="lg">{matchCards}</Grid>
      </div>
    );
  });

  const triviaSection = (
    <Stack gap="sm">
      <Paper p="md" withBorder radius="md" shadow="sm">
        <Group gap="md" align="center">
          <ThemeIcon size="lg" radius="md" color="gray" variant="light">
            <IconX size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="gray.6" fw={500}>
              Procent remisów
            </Text>
            <Text size="md" fw={700}>
              {drawPercentage}%
            </Text>
            <Text size="sm" c="gray">
              z {completedMatches.length} zakończonych meczów
            </Text>
          </Box>
        </Group>
      </Paper>

      <Paper p="md" withBorder radius="md" shadow="sm">
        <Group gap="md" align="center">
          <ThemeIcon size="lg" radius="md" color="gold" variant="light">
            <IconTrophy size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="gray.6" fw={500}>
              Największe zwycięstwo
            </Text>
            <Group gap="xs" align="center">
              <Text size="md" fw={700}>
                {biggestWinMatch.home_name} {biggestWinMatch.home_score} -{" "}
                {biggestWinMatch.away_score} {biggestWinMatch.away_name}
              </Text>
            </Group>
            <Text size="sm" c="gold">
              Różnica: {biggestWinMatch.diff} goli
            </Text>
          </Box>
        </Group>
      </Paper>

      <Paper p="md" withBorder radius="md" shadow="sm">
        <Group gap="md" align="center">
          <ThemeIcon size="lg" radius="md" color="teal" variant="light">
            <IconTargetArrow size={24} />
          </ThemeIcon>
          <Box>
            <Text size="sm" c="gray.6" fw={500}>
              Najwięcej goli w meczu
            </Text>
            <Group gap="xs" align="center">
              <Text size="md" fw={700}>
                {mostGoalsMatch.home_name} {mostGoalsMatch.home_score} -{" "}
                {mostGoalsMatch.away_score} {mostGoalsMatch.away_name}
              </Text>
            </Group>
            <Text size="sm" c="teal">
              Łącznie: {mostGoalsMatch.totalGoals} goli
            </Text>
          </Box>
        </Group>
      </Paper>
    </Stack>
  );

  return (
    <>
      <Group justify="flex-end" mb="md">
        <Select
          placeholder="Filtruj po zespole"
          data={[
            { value: "", label: "Wszystkie zespoły" },
            ...teams.map((team) => ({ value: team.name, label: team.name })),
          ]}
          value={selectedTeam}
          onChange={(value) => setSelectedTeam(value)}
          style={{ width: 250 }}
          clearable
          renderOption={({ option }) => (
            <Group gap="sm" align="center">
              {option.value &&
                teams.find((team) => team.name === option.value)?.logo && (
                  <Image
                    src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${teams.find((team) => team.name === option.value)?.logo}/xlThumb`}
                    height={20}
                    width={20}
                    fit="contain"
                    radius="sm"
                    fallbackSrc="https://via.placeholder.com/20?text=Logo"
                  />
                )}
              <Text>{option.label}</Text>
            </Group>
          )}
        />
      </Group>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          {loading && (
            <Group justify="center" py="xl">
              <Loader size="lg" type="dots" />
            </Group>
          )}
          {!loading && filteredMatches.length > 0 && <div>{matchGroups}</div>}
          {!loading && filteredMatches.length === 0 && (
            <Text c="gray" ta="center">
              {selectedTeam
                ? `Brak meczów dla zespołu ${selectedTeam}`
                : "Brak meczów dla wybranego sezonu"}
            </Text>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          {!loading && completedMatches.length > 0 && triviaSection}
        </Grid.Col>
      </Grid>
    </>
  );
}