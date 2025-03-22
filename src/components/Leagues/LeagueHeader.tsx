import { Group, Title, Image, Select } from "@mantine/core";

interface League {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

interface LeagueHeaderProps {
  leagueInfo: League | null;
  loadingLeague: boolean;
  leagueSlug: string;
  seasons: number[];
  selectedSeason: string | null;
  setSelectedSeason: (value: string) => void;
}

export function LeagueHeader({ 
  leagueInfo, 
  loadingLeague, 
  leagueSlug, 
  seasons, 
  selectedSeason, 
  setSelectedSeason 
}: LeagueHeaderProps) {
  return (
    <Group justify="space-between" align="center">
      <Group gap="md" align="center">
        {leagueInfo?.logo && !loadingLeague && (
          <Image
            src={`https://virtualprogaming.com/cdn-cgi/imagedelivery/cl8ocWLdmZDs72LEaQYaYw/${leagueInfo.logo}/xlThumb`}
            height={50}
            width={50}
            fit="contain"
            alt={leagueInfo.name}
            radius="sm"
            fallbackSrc="https://via.placeholder.com/50?text=Logo"
          />
        )}
        <Title order={2}>{leagueInfo?.name || leagueSlug}</Title>
      </Group>
      <Select
        label="Wybierz sezon"
        placeholder="Sezon"
        data={seasons.map((season) => ({
          value: season.toString(),
          label: `Sezon ${season}`,
        }))}
        value={selectedSeason}
        onChange={(value) => setSelectedSeason(value as string)}
        style={{ width: 200 }}
      />
    </Group>
  );
}