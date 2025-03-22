import { useState, useEffect } from "react";
import { Group, Loader, Text, Image, Select, Pagination, Paper, Stack, Title, Badge, Avatar, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

interface PlayerEntry {
  username: string;
  user_avatar: string | null;
  user_nationality: string;
  team_name: string;
  team_logo: string;
  matches_played: number | null;
  goals: number | null;
  assists: number | null;
  clean_sheet: number | null;
  saves: number | null;
  interceptions: number | null;
  points: number | null;
}

interface LeaderboardResponse {
  count: number;
  data: PlayerEntry[];
}

interface LeagueLeadersProps {
  leagueSlug: string;
  selectedSeason: string | null;
}

export function LeagueLeaders({ leagueSlug, selectedSeason }: LeagueLeadersProps) {
  const [leaderboardData, setLeaderboardData] = useState<PlayerEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<string>("top_gk");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchLeaderboardData = async (type: string, offset: number) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/players/leaderboard/?leaderboard=${type}&limit=${itemsPerPage}&offset=${offset}`;
      const response = await fetch(url, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU2ODY2MiwiaWF0IjoxNzQyNTY2ODYyLCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.P0-3puVEOFhRJV7oncboQBVnlUl3Df22SCDkJpTNF-U',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Nie udało się pobrać danych rankingu");
      }

      const data: LeaderboardResponse = await response.json();
      setLeaderboardData(data.data);
      setTotalCount(data.count);
      console.log("Pobrane dane:", data.data.length, "Total count:", data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      setLeaderboardData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeason) {
      fetchLeaderboardData(leaderboardType, (page - 1) * itemsPerPage);
    }
  }, [leaderboardType, page, selectedSeason, leagueSlug]);

  const leaderboardOptions = [
    { value: "top_scorer", label: "Najlepsi strzelcy", statLabel: "Bramki" },
    { value: "top_assist", label: "Najlepsi asystenci", statLabel: "Asysty" },
    { value: "top_gk", label: "Najlepsi bramkarze", statLabel: "Obrony" },
    { value: "most_games", label: "Najwięcej meczów", statLabel: "Mecze" },
    { value: "most_interceptions", label: "Najwięcej przechwytów", statLabel: "Przechwyty" },
    { value: "most_cleansheets", label: "Najwięcej czystych kont", statLabel: "Czyste konta" },
  ];

  const getStatValue = (player: PlayerEntry) => {
    switch (leaderboardType) {
      case "top_scorer": return player.goals ?? 0;
      case "top_assist": return player.assists ?? 0;
      case "top_gk": return player.saves ?? 0;
      case "most_games": return player.matches_played ?? 0;
      case "most_interceptions": return player.interceptions ?? 0;
      case "most_cleansheets": return player.clean_sheet ?? 0;
      default: return player.points ?? 0;
    }
  };

  const selectedLeaderboard = leaderboardOptions.find(opt => opt.value === leaderboardType);

  const playerCards = leaderboardData.map((player, index) => (
    <Paper key={player.username} withBorder radius="md" p="sm" shadow="sm">
      <Group align="center" wrap="wrap" gap="xs">
        <Text c="gray" fw={700} size="lg">
          {(page - 1) * itemsPerPage + index + 1}.
        </Text>
        {player.user_avatar ? (
          <Image
            src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${player.user_avatar}/xlThumb`}
            height={40}
            width={40}
            fit="contain"
            alt={player.username}
            radius="sm"
          />
        ) : (
          <Avatar size={40} radius="sm" color="gray">
            {player.username[0].toUpperCase()}
          </Avatar>
        )}
        <Stack gap={4} style={{ flex: "1 1 auto" }}>
          <Title order={4} style={{ fontSize: "16px" }}>{player.username}</Title>
          <Badge variant="light" color="gray" size="sm">{player.user_nationality}</Badge>
        </Stack>
        <Group gap="sm" align="center" wrap="nowrap" style={{ flex: "1 1 auto" }}>
          {player.team_logo ? (
            <Image
              src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${player.team_logo}/xlThumb`}
              height={40}
              width={40}
              fit="contain"
              alt={player.team_name}
              radius="sm"
            />
          ) : (
            <Avatar size={40} radius="sm" color="gray">
              {player.team_name[0].toUpperCase()}
            </Avatar>
          )}
          <Text size="md" c="gray" fw={500} style={{ wordBreak: "break-word" }}>
            {player.team_name}
          </Text>
        </Group>
        <Group gap="sm" wrap="wrap" style={{ justifyContent: "flex-end" }}>
          <Badge color="blue" size="md" variant="light">
            {selectedLeaderboard?.statLabel}: {getStatValue(player)}
          </Badge>
          <Badge color="gray" size="md" variant="light">
            Mecze: {player.matches_played ?? 0}
          </Badge>
        </Group>
      </Group>
    </Paper>
  ));

  return (
    <>
      <Stack gap="md" mb="lg">
        <Select
          label="Wybierz ranking"
          data={leaderboardOptions.map(opt => ({ value: opt.value, label: opt.label }))}
          value={leaderboardType}
          onChange={(value) => {
            setLeaderboardType(value as string);
            setPage(1);
          }}
          style={{ maxWidth: "300px" }}
        />
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Błąd" color="red" mb="lg">
          {error}
        </Alert>
      )}

      {loading && (
        <Group justify="center" py="xl">
          <Loader size="lg" type="dots" />
        </Group>
      )}

      {!loading && !error && leaderboardData.length > 0 && (
        <>
          <Stack gap="sm">
            {playerCards}
          </Stack>
          <Group justify="center" mt="sm">
            <Pagination
              total={Math.ceil(totalCount / itemsPerPage)}
              value={page}
              onChange={setPage}
              size="sm"
              withEdges
            />
          </Group>
        </>
      )}

      {!loading && !error && leaderboardData.length === 0 && (
        <Text c="gray" ta="center" size="md" py="xl">
          Brak danych dla wybranego rankingu
        </Text>
      )}
    </>
  );
}