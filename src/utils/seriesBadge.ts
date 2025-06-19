export interface SeriesBadgeConfig {
  name: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export function getSeriesBadgeConfig(seriesSlug: string): SeriesBadgeConfig {
  const badgeConfigs: Record<string, SeriesBadgeConfig> = {
    isomon: {
      name: 'ISOMON',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    devlog: {
      name: 'devlog',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-200'
    },
    geo: {
      name: 'GEO',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
    tfp: {
      name: 'TFP',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    }
  };

  // Return the config for the series, or a default one
  return badgeConfigs[seriesSlug] || {
    name: seriesSlug.toUpperCase(),
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-200'
  };
}
