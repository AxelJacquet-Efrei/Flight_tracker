/**
 * @file climatiqApi.js
 * Wrapper API Climatiq avec gestion centralisée des erreurs
 */

const CLIMATIQ_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLIMATIQ_API_KEY)
    ? import.meta.env.VITE_CLIMATIQ_API_KEY
    : process.env.VITE_CLIMATIQ_API_KEY;

if (!CLIMATIQ_API_KEY) {
  throw new Error('La variable VITE_CLIMATIQ_API_KEY n\'est pas definie');
}

const BASE_URL = 'https://api.climatiq.io';

/**
 * Classe d'erreur pour uniformiser les retours et messages à afficher
 */
export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Wrapper fetch + gestion des erreurs HTTP & parsing JSON
 * @param {string} url
 * @param {RequestInit} options
 * @returns {Promise<any>}
 * @throws {ApiError}
 */
async function fetchWithError(url, options) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (netErr) {
    throw new ApiError(
      'Impossible de contacter le serveur. Vérifiez votre connexion.',
      0,
      netErr
    );
  }

  const contentType = res.headers.get('Content-Type') || '';
  let textBody = '';
  try {
    textBody = await res.text();
  } catch {}

  if (!res.ok) {
    let detail = textBody;
    if (contentType.includes('application/json')) {
      try {
        const jsonErr = JSON.parse(textBody);
        detail = jsonErr.detail || jsonErr.message || JSON.stringify(jsonErr);
      } catch {}
    }

    let userMsg;
    switch (res.status) {
      case 400:
        userMsg = 'Requête invalide. Vérifiez les paramètres.';
        break;
      case 401:
        userMsg = 'Clé API invalide ou expirée.';
        break;
      case 403:
        userMsg = 'Accès refusé.';
        break;
      case 404:
        userMsg = 'Ressource introuvable.';
        break;
      case 429:
        userMsg = 'Trop de requêtes. Réessayez plus tard.';
        break;
      default:
        userMsg = 'Erreur serveur. Veuillez réessayer ultérieurement.';
    }

    throw new ApiError(userMsg, res.status, detail);
  }

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(textBody);
    } catch {
      throw new ApiError('Réponse inattendue du serveur.', res.status, textBody);
    }
  }

  return textBody;
}

/**
 * Normalise un nom de région cloud (ex. "us-west-2" → "us_west_2")
 */
function normalizeRegion(region) {
  return region.replace(/-/g, '_').replace(/([A-Za-z])(\d+)$/, '$1_$2');
}

/** Calcule les émissions carbone d'un vol */
export async function calculateFlightEmissions(
  origin,
  destination,
  passengers = 1,
  travelClass = 'economy'
) {
  const url = `${BASE_URL}/travel/flights`;
  const body = { legs: [{ from: origin, to: destination, passengers, class: travelClass }] };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Calcule les émissions liées au CPU dans le cloud */
export async function calculateCpuEmissions(
  provider,
  region,
  cpuCount,
  duration,
  averageVcpuUtilization = 0.5,
  year
) {
  const apiRegion = normalizeRegion(region);
  const url = `${BASE_URL}/compute/v1/${provider}/cpu`;
  const body = {
    region: apiRegion,
    cpu_count: cpuCount,
    average_vcpu_utilization: averageVcpuUtilization,
    duration,
    duration_unit: 'hour',
    ...(year !== undefined && { year }),
  };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Calcule les émissions liées au stockage dans le cloud */
export async function calculateStorageEmissions(
  provider,
  region,
  storageType,
  data,
  duration,
  dataUnit = 'MB',
  durationUnit = 'hour',
  year
) {
  const apiRegion = normalizeRegion(region);
  const url = `${BASE_URL}/compute/v1/${provider}/storage`;
  const body = {
    region: apiRegion,
    storage_type: storageType,
    data,
    data_unit: dataUnit,
    duration,
    duration_unit: durationUnit,
    ...(year !== undefined && { year }),
  };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Calcule les émissions liées à la mémoire dans le cloud */
export async function calculateMemoryEmissions(
  provider,
  region,
  data,
  duration,
  dataUnit = 'MB',
  durationUnit = 'hour',
  year
) {
  const apiRegion = normalizeRegion(region);
  const url = `${BASE_URL}/compute/v1/${provider}/memory`;
  const body = {
    region: apiRegion,
    data,
    data_unit: dataUnit,
    duration,
    duration_unit: durationUnit,
    ...(year !== undefined && { year }),
  };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Recherche de facteurs d'émission */
export async function searchEmissionFactors(query, filters = {}) {
  const params = new URLSearchParams({ query });
  if (filters.limit) {
    params.append('results_per_page', filters.limit);
    delete filters.limit;
  }
  Object.entries(filters).forEach(([k, v]) => {
    if (v != null && v !== '') params.append(k, String(v));
  });
  const url = `${BASE_URL}/data/v1/search?${params.toString()}`;
  return fetchWithError(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
}

/** Récupère un facteur d'émission par ID */
export async function getEmissionFactorById(id) {
  const url = `${BASE_URL}/data/v1/emission-factors/${id}`;
  return fetchWithError(url, {
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });
}

/** Calcule des émissions custom via custom-mappings */
export async function calculateCustomEmissions(
  customLabel,
  parameters,
  options = {}
) {
  const {
    dataVersion = '0.0',
    source,
    region,
    regionFallback = false,
    yearFallback = false,
    year,
    sourceLcaActivity,
    calculationMethod,
    allowedDataQualityFlags,
  } = options;

  const customMapping = { label: customLabel, data_version: dataVersion };
  if (source) customMapping.source = source;
  if (region) customMapping.region = region;
  if (regionFallback) customMapping.region_fallback = regionFallback;
  if (yearFallback) customMapping.year_fallback = yearFallback;
  if (year) customMapping.year = year;
  if (sourceLcaActivity) customMapping.source_lca_activity = sourceLcaActivity;
  if (calculationMethod) customMapping.calculation_method = calculationMethod;
  if (allowedDataQualityFlags)
    customMapping.allowed_data_quality_flags = allowedDataQualityFlags;

  const url = `${BASE_URL}/custom-mappings/v1/estimate`;
  const body = { custom_mapping: customMapping, parameters };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Crée des labels pour custom-mappings */
export async function createCustomMappingLabels(labels, dataVersion = '0.0') {
  const url = `${BASE_URL}/custom-mappings/v1/labels`;
  const body = {
    data_version: dataVersion,
    labels: labels.map((l) => ({
      label: typeof l === 'string' ? l : l.label,
      ...(l.unit_type && { unit_type: l.unit_type }),
      ...(l.source && { source: l.source }),
      ...(l.allow_duplicates != null && { allow_duplicates: l.allow_duplicates }),
    })),
  };
  return fetchWithError(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/** Récupère les régions cloud, fallback statique en cas d'erreur */
export async function getCloudRegions(provider) {
  try {
    const data = await fetchWithError(
      `${BASE_URL}/compute/v1/${provider}/regions`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLIMATIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return data.regions || [];
  } catch (err) {
    console.warn(`Impossible de récupérer les régions pour ${provider}, fallback statique`, err);
    return getStaticRegions(provider);
  }
}

/** Liste statique de régions si l'API échoue */
function getStaticRegions(provider) {
  const staticRegions = {
    aws: [
      { id: 'us-east-1', name: 'US East (N. Virginia)' },
      { id: 'us-west-1', name: 'US West (N. California)' },
      { id: 'us-west-2', name: 'US West (Oregon)' },
      { id: 'eu-west-1', name: 'EU (Ireland)' },
      { id: 'eu-central-1', name: 'EU (Frankfurt)' },
      { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
      { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
    ],
    gcp: [
      { id: 'us-central1', name: 'US Central (Iowa)' },
      { id: 'us-east1', name: 'US East (South Carolina)' },
      { id: 'us-west1', name: 'US West (Oregon)' },
      { id: 'europe-west1', name: 'Europe West (Belgium)' },
      { id: 'europe-west4', name: 'Europe West (Netherlands)' },
      { id: 'asia-southeast1', name: 'Asia Southeast (Singapore)' },
      { id: 'asia-east1', name: 'Asia East (Taiwan)' },
    ],
    azure: [
      { id: 'eastus', name: 'East US (Virginia)' },
      { id: 'westus', name: 'West US (California)' },
      { id: 'westus2', name: 'West US 2 (Washington)' },
      { id: 'westeurope', name: 'West Europe (Netherlands)' },
      { id: 'northeurope', name: 'North Europe (Ireland)' },
      { id: 'southeastasia', name: 'Southeast Asia (Singapore)' },
      { id: 'eastasia', name: 'East Asia (Hong Kong)' },
    ],
  };

  return staticRegions[provider] || [];
}

/** Compare les émissions de CO2 entre différents pays pour une activité donnée */
export async function compareEmissionsByCountries(activityType, parameters, countries) {
  const results = await Promise.all(
    countries.map(async (country) => {
      const response = await calculateCustomEmissions(
        activityType,
        { ...parameters, country },
        { regionFallback: true }
      );
      return {
        country,
        co2e: response.co2e,
        unit: response.co2e_unit
      };
    })
  );
  return results;
}

/** Compare les émissions de CO2 entre différents types de transport */
export async function compareTransportEmissions(parameters, transportTypes) {
  const results = await Promise.all(
    transportTypes.map(async (type) => {
      const response = await calculateCustomEmissions(
        `transport_${type}`,
        parameters,
        { regionFallback: true }
      );
      return {
        type,
        co2e: response.co2e,
        unit: response.co2e_unit
      };
    })
  );
  return results;
}

/** Compare les émissions de CO2 entre différents types d'énergie */
export async function compareEnergyEmissions(parameters, energyTypes) {
  const results = await Promise.all(
    energyTypes.map(async (type) => {
      const response = await calculateCustomEmissions(
        `energy_${type}`,
        parameters,
        { regionFallback: true }
      );
      return {
        type,
        co2e: response.co2e,
        unit: response.co2e_unit
      };
    })
  );
  return results;
}

/** Compare les émissions de CO2 entre différents types d'activités */
export async function compareActivitiesEmissions(activities) {
  const results = await Promise.all(
    activities.map(async (activity) => {
      let response;
      switch (activity.type) {
        case 'flight':
          response = await calculateFlightEmissions(
            activity.parameters.origin,
            activity.parameters.destination,
            activity.parameters.passengers,
            activity.parameters.travelClass
          );
          break;
        case 'cpu':
          response = await calculateCpuEmissions(
            activity.parameters.provider,
            activity.parameters.region,
            activity.parameters.cpuCount,
            activity.parameters.duration,
            activity.parameters.averageVcpuUtilization,
            activity.parameters.year
          );
          break;
        case 'storage':
          response = await calculateStorageEmissions(
            activity.parameters.provider,
            activity.parameters.region,
            activity.parameters.storageType,
            activity.parameters.data,
            activity.parameters.duration,
            activity.parameters.dataUnit,
            activity.parameters.durationUnit,
            activity.parameters.year
          );
          break;
        case 'memory':
          response = await calculateMemoryEmissions(
            activity.parameters.provider,
            activity.parameters.region,
            activity.parameters.data,
            activity.parameters.duration,
            activity.parameters.dataUnit,
            activity.parameters.durationUnit,
            activity.parameters.year
          );
          break;
        default:
          response = await calculateCustomEmissions(
            activity.type,
            activity.parameters,
            { regionFallback: true }
          );
      }
      return {
        name: activity.name,
        type: activity.type,
        co2e: response.co2e,
        unit: response.co2e_unit
      };
    })
  );
  return results;
}

/** Obtient les statistiques d'émissions par pays */
export async function getCountryEmissionsStats(countries) {
  const results = await Promise.all(
    countries.map(async (country) => {
      const response = await calculateCustomEmissions(
        'country_emissions',
        { country },
        { regionFallback: true }
      );
      return {
        country,
        totalEmissions: response.co2e,
        unit: response.co2e_unit,
        year: response.year || new Date().getFullYear()
      };
    })
  );
  return results;
}
