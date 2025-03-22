import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Loader, Alert, Tabs, Group } from "@mantine/core";
import { IconX, IconTable, IconSoccerField, IconTrophy } from '@tabler/icons-react';
import { LeagueHeader } from "../components/Leagues/LeagueHeader";
import { LeagueTable } from "../components/Leagues/LeagueTable";
import { LeagueMatches } from "../components/Leagues/LeagueMatches";
import { LeagueLeaders } from "../components/Leagues/LeagueLeaders";

interface League {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export function LeagueTablePage() {
  const params = useParams<{ leagueSlug: string }>();
  const leagueSlug = params.leagueSlug ?? '';
  const [leagueInfo, setLeagueInfo] = useState<League | null>(null);
  const [seasons, setSeasons] = useState<number[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeasons = async () => {
    if (!leagueSlug) {
      setError("Brak identyfikatora ligi");
      return;
    }
    try {
      const response = await fetch(
        `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/seasons/`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seasons");
      }

      const data: number[] = await response.json();
      setSeasons(data);
      setSelectedSeason(data[0]?.toString() || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const fetchLeagueInfo = async () => {
    if (!leagueSlug) {
      setError("Brak identyfikatora ligi");
      setLoadingLeague(false);
      return;
    }
    setLoadingLeague(true);
    try {
      const response = await fetch(
        `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch league info");
      }

      const data: League = await response.json();
      setLeagueInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoadingLeague(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
    fetchLeagueInfo();
  }, [leagueSlug]);

  if (!leagueSlug) {
    return (
      <Container fluid >
        <Alert color="red" title="Błąd" icon={<IconX size={20} />} variant="outline">
          Brak identyfikatora ligi w adresie URL
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <LeagueHeader 
        leagueInfo={leagueInfo} 
        loadingLeague={loadingLeague} 
        leagueSlug={leagueSlug} 
        seasons={seasons} 
        selectedSeason={selectedSeason} 
        setSelectedSeason={setSelectedSeason} 
      />

      {error && (
        <Alert color="red" title="Błąd" icon={<IconX size={20} />} variant="outline">
          {error}
        </Alert>
      )}

      <Tabs defaultValue="table">
        <Tabs.List>
          <Tabs.Tab value="table" leftSection={<IconTable size={16} />}>
            Tabela
          </Tabs.Tab>
          <Tabs.Tab value="matches" leftSection={<IconSoccerField size={16} />}>
            Mecze
          </Tabs.Tab>
          <Tabs.Tab value="ranking" leftSection={<IconTrophy size={16} />}>
            Ranking
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="table" pt="md">
          <LeagueTable leagueSlug={leagueSlug} selectedSeason={selectedSeason} />
        </Tabs.Panel>

        <Tabs.Panel value="matches" pt="md">
          <LeagueMatches leagueSlug={leagueSlug} selectedSeason={selectedSeason} />
        </Tabs.Panel>

        <Tabs.Panel value="ranking" pt="md">
          <LeagueLeaders leagueSlug={leagueSlug} selectedSeason={selectedSeason} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}