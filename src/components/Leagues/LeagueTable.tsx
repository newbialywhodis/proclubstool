import { useState, useEffect } from "react";
import { Group, Loader, Text, Table, Image, Badge, ScrollArea, Grid, Paper, Title, Box, Stack, ThemeIcon } from "@mantine/core";
import { IconTrophy, IconTargetArrow, IconShieldOff, IconX } from "@tabler/icons-react";

interface TableEntry {
  team_name: string;
  team_abbr: string;
  team_slug: string;
  team_logo?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  score_for: number;
  score_against: number;
  points: number;
  titles: number;
}

interface LeagueTableProps {
  leagueSlug: string;
  selectedSeason: string | null;
}

export function LeagueTable({ leagueSlug, selectedSeason }: LeagueTableProps) {
  const [tableData, setTableData] = useState<TableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTableData = async (season: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.virtualprogaming.com/public/leagues/${leagueSlug}/table/?season=${season}&is_history=true`,
        {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4MzEyMTQsInVzZXJuYW1lIjoiYmlhbHltb2RlbHUiLCJyZWZyZXNoIjpmYWxzZSwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlciI6ZmFsc2UsImV4cCI6MTc0MjU0ODM2NywiaWF0IjoxNzQyNTQ2NTY3LCJzdWIiOiI4MzEyMTQiLCJhdWQiOiJ2aXJ0dWFscHJvZ2FtaW5nLmNvbSIsImlzcyI6ImFwaS52aXJ0dWFscHJvZ2FtaW5nLmNvbSJ9.w2uNy6gmrhEAEFZd4KWqftqm8SE--TPPiW4jX05D9AY',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch table data");
      }

      const data = await response.json();
      setTableData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSeason) {
      fetchTableData(selectedSeason);
    }
  }, [selectedSeason, leagueSlug]);

  const mostGoalsScored = tableData.reduce((max, team) => 
    team.score_for > max.score_for ? team : max, tableData[0]);
  const mostGoalsConceded = tableData.reduce((max, team) => 
    team.score_against > max.score_against ? team : max, tableData[0]);
  const mostWins = tableData.reduce((max, team) => 
    team.wins > max.wins ? team : max, tableData[0]);
  const mostLosses = tableData.reduce((max, team) => 
    team.losses > max.losses ? team : max, tableData[0]);

  const tableRows = tableData.map((entry, index) => (
    <Table.Tr key={entry.team_slug}>
      <Table.Td ta="center">{index + 1}</Table.Td>
      <Table.Td>
        <Group gap="xs" wrap="nowrap">
          {entry.team_logo && (
            <Image
              src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${entry.team_logo}/xlThumb`}
              height={24}
              width={24}
              fit="contain"
              alt={entry.team_name}
              radius="sm"
              fallbackSrc="https://via.placeholder.com/24?text=Logo"
            />
          )}
          <Text fw={500} size="sm" truncate="end">
            {entry.team_name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td ta="center">{entry.played}</Table.Td>
      <Table.Td ta="center">
        <Badge color="green" variant="light" size="sm">{entry.wins}</Badge>
      </Table.Td>
      <Table.Td ta="center">
        <Badge color="gray" variant="light" size="sm">{entry.draws}</Badge>
      </Table.Td>
      <Table.Td ta="center">
        <Badge color="red" variant="light" size="sm">{entry.losses}</Badge>
      </Table.Td>
      <Table.Td ta="center">{entry.score_for}</Table.Td>
      <Table.Td ta="center">{entry.score_against}</Table.Td>
      <Table.Td ta="center">
        <Badge color="blue" size="sm" radius="sm">{entry.points}</Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {loading && (
        <Group justify="center" py="xl">
          <Loader size="lg" type="dots" />
        </Group>
      )}
      {!loading && tableData.length > 0 && (
        <Grid gutter={{ base: "xs", sm: "md" }}>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <ScrollArea w="100%" type="auto">
              <Table
                highlightOnHover
                verticalSpacing="xs"
                horizontalSpacing="xs"
                withTableBorder
                styles={{
                  table: {
                    minWidth: "600px",
                    fontSize: "12px",
                    "@media (min-width: 768px)": {
                      fontSize: "14px",
                    },
                  },
                  th: {
                    whiteSpace: "nowrap",
                    padding: "8px",
                    "@media (min-width: 768px)": {
                      padding: "12px",
                    },
                  },
                  td: {
                    padding: "8px",
                    "@media (min-width: 768px)": {
                      padding: "12px",
                    },
                  },
                }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th ta="center" w={30}>#</Table.Th>
                    <Table.Th w={150}>Drużyna</Table.Th>
                    <Table.Th ta="center" w={50}>Mecze</Table.Th>
                    <Table.Th ta="center" w={40}>W</Table.Th>
                    <Table.Th ta="center" w={40}>R</Table.Th>
                    <Table.Th ta="center" w={40}>P</Table.Th>
                    <Table.Th ta="center" w={50}>Gole +</Table.Th>
                    <Table.Th ta="center" w={50}>Gole -</Table.Th>
                    <Table.Th ta="center" w={60}>Punkty</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{tableRows}</Table.Tbody>
              </Table>
            </ScrollArea>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="sm">
              <Paper p="md" withBorder radius="md" shadow="sm">
                <Group gap="md" align="center">
                  <ThemeIcon size="lg" radius="md" color="gold" variant="light">
                    <IconTrophy size={24} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" c="gray.6" fw={500}>Najwięcej zwycięstw</Text>
                    <Group gap="sm" align="center">
                      {mostWins?.team_logo && (
                        <Image
                          src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${mostWins.team_logo}/xlThumb`}
                          height={40}
                          width={40}
                          fit="contain"
                          alt={mostWins.team_name}
                          radius="sm"
                          fallbackSrc="https://via.placeholder.com/40?text=Logo"
                        />
                      )}
                      <Box>
                        <Text size="md" fw={700}>{mostWins?.team_name}</Text>
                        <Text size="sm" c="green">{mostWins?.wins} zwycięstw</Text>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Paper>

              <Paper p="md" withBorder radius="md" shadow="sm">
                <Group gap="md" align="center">
                  <ThemeIcon size="lg" radius="md" color="teal" variant="light">
                    <IconTargetArrow size={24} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" c="gray.6" fw={500}>Najwięcej goli strzelonych</Text>
                    <Group gap="sm" align="center">
                      {mostGoalsScored?.team_logo && (
                        <Image
                          src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${mostGoalsScored.team_logo}/xlThumb`}
                          height={40}
                          width={40}
                          fit="contain"
                          alt={mostGoalsScored.team_name}
                          radius="sm"
                          fallbackSrc="https://via.placeholder.com/40?text=Logo"
                        />
                      )}
                      <Box>
                        <Text size="md" fw={700}>{mostGoalsScored?.team_name}</Text>
                        <Text size="sm" c="teal">{mostGoalsScored?.score_for} goli</Text>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Paper>

              <Paper p="md" withBorder radius="md" shadow="sm">
                <Group gap="md" align="center">
                  <ThemeIcon size="lg" radius="md" color="red" variant="light">
                    <IconShieldOff size={24} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" c="gray.6" fw={500}>Najwięcej goli straconych</Text>
                    <Group gap="sm" align="center">
                      {mostGoalsConceded?.team_logo && (
                        <Image
                          src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${mostGoalsConceded.team_logo}/xlThumb`}
                          height={40}
                          width={40}
                          fit="contain"
                          alt={mostGoalsConceded.team_name}
                          radius="sm"
                          fallbackSrc="https://via.placeholder.com/40?text=Logo"
                        />
                      )}
                      <Box>
                        <Text size="md" fw={700}>{mostGoalsConceded?.team_name}</Text>
                        <Text size="sm" c="red">{mostGoalsConceded?.score_against} goli</Text>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Paper>

              <Paper p="md" withBorder radius="md" shadow="sm">
                <Group gap="md" align="center">
                  <ThemeIcon size="lg" radius="md" color="gray" variant="light">
                    <IconX size={24} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" c="gray.6" fw={500}>Najwięcej porażek</Text>
                    <Group gap="sm" align="center">
                      {mostLosses?.team_logo && (
                        <Image
                          src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${mostLosses.team_logo}/xlThumb`}
                          height={40}
                          width={40}
                          fit="contain"
                          alt={mostLosses.team_name}
                          radius="sm"
                          fallbackSrc="https://via.placeholder.com/40?text=Logo"
                        />
                      )}
                      <Box>
                        <Text size="md" fw={700}>{mostLosses?.team_name}</Text>
                        <Text size="sm" c="gray">{mostLosses?.losses} porażek</Text>
                      </Box>
                    </Group>
                  </Box>
                </Group>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      )}
      {!loading && tableData.length === 0 && (
        <Text c="gray" ta="center" size="sm" py="xl">
          Brak danych tabeli dla wybranego sezonu
        </Text>
      )}
    </>
  );
}