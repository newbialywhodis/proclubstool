import { useState, useEffect } from "react";
import { 
  Container, 
  Loader, 
  Alert,
  TextInput,
  Grid,
  Card,
  Image,
  Text,
  Group,
  Pagination,
  Paper,
  Select,
  Badge,
  Modal,
  Title,
  Stack,
} from "@mantine/core";
import { IconSearch, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface Community {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  platform?: string;
  player_count?: number;
  team_count?: number;
  region?: string;
}

interface League {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

interface ApiResponse<T> {
  count: number;
  data: T[];
}

const itemsPerPage = 12;

export function CompetitionsList() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCommunities = async (offset: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.virtualprogaming.com/public/communities/?limit=${itemsPerPage}&offset=${offset}`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch communities");
      }

      const data: ApiResponse<Community> = await response.json();
      setCommunities(data.data);
      setTotalCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeagues = async (communitySlug: string) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const response = await fetch(
        `https://api.virtualprogaming.com/public/communities/${communitySlug}/leagues/?limit=12&offset=0`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6imFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leagues");
      }

      const data: ApiResponse<League> = await response.json();
      setLeagues(data.data);
    } catch (err) {
      setModalError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities((activePage - 1) * itemsPerPage);
  }, [activePage]);

  const sortCommunities = (communities: Community[]) => {
    if (!sortBy) return communities.filter((community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...communities].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'players':
          return (b.player_count || 0) - (a.player_count || 0);
        case 'teams':
          return (b.team_count || 0) - (a.team_count || 0);
        case 'region':
          return (a.region || '').localeCompare(b.region || '');
        default:
          return 0;
      }
    });

    return sorted.filter((community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCardClick = (community: Community) => {
    setSelectedCommunity(community);
    fetchLeagues(community.slug);
  };

  const handleLeagueClick = (leagueSlug: string) => {
    navigate(`/league/${leagueSlug}`);
  };

  const filteredAndSortedCommunities = sortCommunities(communities);

  return (
    <Container fluid>
      <Group justify="space-between" mb="md" align="center">
        <TextInput
          placeholder="Szukaj rozgrywek..."
          leftSection={<IconSearch size={16} />}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Sortuj według"
          data={[
            { value: 'name', label: 'Nazwa' },
            { value: 'players', label: 'Gracze' },
            { value: 'teams', label: 'Drużyny' },
            { value: 'region', label: 'Region' },
          ]}
          value={sortBy}
          onChange={setSortBy}
          style={{ width: 200 }}
        />
      </Group>

      {loading && (
        <Group justify="center" py="xl">
          <Loader size="lg" type="dots" />
        </Group>
      )}
      
      {error && (
        <Alert color="red" title="Błąd" mb="lg" icon={<IconX size={20} />} variant="outline">
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        filteredAndSortedCommunities.length > 0 ? (
          <>
            <Grid gutter="lg">
              {filteredAndSortedCommunities.map((community) => (
                <Grid.Col key={community.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleCardClick(community)}
                  >
                    {community.logo && (
                      <Card.Section>
                        <Image
                          src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${community.logo}/xlThumb`}
                          height={160}
                          fit="contain"
                          alt={community.name}
                          radius="md"
                          fallbackSrc="https://via.placeholder.com/160?text=Logo"
                        />
                      </Card.Section>
                    )}
                    <Group justify="space-between" mt="md" mb="xs">
                      <Text fw={500}>{community.name}</Text>
                    </Group>
                    <Group gap="xs">
                      <Badge color="blue" variant="light">
                        Region: {community.region || 'N/A'}
                      </Badge>
                      <Badge color="green" variant="light">
                        Gracze: {community.player_count || 0}
                      </Badge>
                      <Badge color="orange" variant="light">
                        Drużyny: {community.team_count || 0}
                      </Badge>
                    </Group>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            <Group justify="center" mt="xl">
              <Pagination
                total={Math.ceil(totalCount / itemsPerPage)}
                value={activePage}
                onChange={setActivePage}
                size="md"
                radius="md"
                withEdges
              />
            </Group>
          </>
        ) : (
          <Paper p="xl" withBorder radius="md">
            <Text c="gray" ta="center" size="lg">
              {searchTerm ? 'Brak wyników dla podanego wyszukiwania' : 'Brak danych do wyświetlenia'}
            </Text>
          </Paper>
        )
      )}

      <Modal
        opened={!!selectedCommunity}
        onClose={() => setSelectedCommunity(null)}
        title={<Title order={3}>{selectedCommunity?.name} - Ligi</Title>}
        size="lg"
      >
        {modalLoading && (
          <Group justify="center" py="xl">
            <Loader size="lg" type="dots" />
          </Group>
        )}
        
        {modalError && (
          <Alert color="red" title="Błąd" mb="lg" icon={<IconX size={20} />} variant="outline">
            {modalError}
          </Alert>
        )}

        {!modalLoading && !modalError && leagues.length > 0 && (
          <Grid gutter="md">
            {leagues.map((league) => (
              <Grid.Col span={{ base: 12, sm: 6 }} key={league.id}>
                <Paper 
                  withBorder 
                  p="md" 
                  radius="md" 
                  shadow="sm"
                  component="button"
                  onClick={() => handleLeagueClick(league.slug)}
                  style={{ width: '100%', cursor: 'pointer'  }}
                >
                  <Group gap="md" align="center">
                    {league.logo && (
                      <Image
                        src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${league.logo}/xlThumb`}
                        height={50}
                        width={50}
                        fit="contain"
                        alt={league.name}
                        radius="sm"
                        fallbackSrc="https://via.placeholder.com/50?text=Logo"
                      />
                    )}
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text fw={500} size="md" lineClamp={1}>{league.name}</Text>
                      <Badge variant="outline" color="gray" size="sm">
                        {league.slug}
                      </Badge>
                    </Stack>
                  </Group>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        )}

        {!modalLoading && !modalError && leagues.length === 0 && (
          <Text c="gray" ta="center">Brak lig do wyświetlenia</Text>
        )}
      </Modal>
    </Container>
  );
}