// src/lib/climatiq.js

// 1) Récupération de la clé API (Vite ou Node)
/**
 * Clé API pour accéder aux endpoints Climatiq.
 * Je la récupère depuis les variables d'environnement VITE ou Node.
 * @type {string}
 * @throws {Error} Si la variable d'environnement VITE_CLIMATIQ_API_KEY n’est pas définie.
 */
const CLIMATIQ_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLIMATIQ_API_KEY)
    ? import.meta.env.VITE_CLIMATIQ_API_KEY
    : process.env.VITE_CLIMATIQ_API_KEY;

if (!CLIMATIQ_API_KEY) {
  throw new Error('La variable VITE_CLIMATIQ_API_KEY n’est pas définie');
}

/** URL de base pour toutes les requêtes Climatiq */
const BASE_URL = 'https://api.climatiq.io';

/**
 * Utilitaire : normalise le nom de région pour l’API.
 * - Remplace les tirets par des underscores.
 * - Insère un underscore avant la partie numérique finale.
 *
 * @param {string} region Nom de la région au format "us-west-2" ou similaire.
 * @returns {string} Région formatée pour l’API (ex. "us_west_2").
 */
function normalizeRegion(region) {
  return region
    .replace(/-/g, '_')                   // je transforme les tirets en underscores
    .replace(/([A-Za-z])(\d+)$/, '$1_$2'); // j’ajoute un underscore avant les chiffres finaux
}

// 2) Vols (travel/flights)
/**
 * Calcule les émissions carbone d’un vol.
 *
 * @param {string} origin Code IATA de l’aéroport de départ.
 * @param {string} destination Code IATA de l’aéroport d’arrivée.
 * @param {number} [passengers=1] Nombre de passagers.
 * @param {string} [travelClass='economy'] Classe de voyage (economy, business, etc.).
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateFlightEmissions(
  origin,
  destination,
  passengers = 1,
  travelClass = 'economy'
) {
  try {
    const response = await fetch(`${BASE_URL}/travel/flights`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        legs: [{ from: origin, to: destination, passengers, class: travelClass }],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
   throw error;
  }
}

// 3) Voiture (estimate + activity_id + data_version)
/**
 * Calcule les émissions carbone d’un trajet en voiture.
 *
 * @param {number} distance Distance parcourue.
 * @param {string} [vehicleType='medium'] Type de véhicule (small, medium, large).
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateCarEmissions(distance, vehicleType = 'medium') {
  // Je construis l’activity_id en fonction du type de véhicule
  const activityId =
    `passenger_vehicle-vehicle_type_${vehicleType}_car` +
    `-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na`;

  try {
    const response = await fetch(`${BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_factor: { activity_id: activityId, data_version: "22.22" },
        parameters: { distance, distance_unit: "km" }
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 4) Train (estimate + UUID selector pour "national")
/**
 * Calcule les émissions carbone d’un trajet en train.
 *
 * @param {number} distance Distance parcourue en kilomètres.
 * @param {string} [trainType='national'] Type de train (national, international, light_rail).
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateTrainEmissions(distance, trainType = 'national') {
  const TRAIN_FACTOR_IDS = {
    national:      '409f6cf7-ff4b-4c58-9bf1-7150919a6664',
    international: 'REPLACE_WITH_INTERNATIONAL_RAIL_UUID',
    light_rail:    'REPLACE_WITH_LIGHT_RAIL_UUID',
  };
  const factorId = TRAIN_FACTOR_IDS[trainType] || TRAIN_FACTOR_IDS.national;

  try {
    const response = await fetch(`${BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_factor: { id: factorId },
        parameters: { distance, distance_unit: "km" }
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 5) Bus (estimate + UUID selector pour "local")
/**
 * Calcule les émissions carbone d’un trajet en bus.
 *
 * @param {number} distance Distance parcourue en kilomètres.
 * @param {string} [busType='local'] Type de bus (local, long_distance, school).
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateBusEmissions(distance, busType = 'local') {
  const BUS_FACTOR_IDS = {
    local:         '2246ac54-c55e-4b4c-9201-f23f934b18e2',
    long_distance: 'REPLACE_WITH_LONG_DISTANCE_COACH_UUID',
    school:        'REPLACE_WITH_SCHOOL_BUS_UUID',
  };
  const factorId = BUS_FACTOR_IDS[busType] || BUS_FACTOR_IDS.local;

  try {
    const response = await fetch(`${BASE_URL}/estimate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emission_factor: { id: factorId },
        parameters: { distance, distance_unit: "km" }
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 6) Cloud Computing – CPU (compute/v1/:provider/cpu)
/**
 * Calcule les émissions carbone liées à l’utilisation de CPU dans le cloud.
 *
 * @param {string} provider Nom du fournisseur (aws, gcp, azure, etc.).
 * @param {string} region Région cloud (ex. "eu-west-1").
 * @param {number} cpuCount Nombre de vCPU utilisées.
 * @param {number} duration Durée de l’utilisation.
 * @param {number} [averageVcpuUtilization=0.5] Taux moyen d’utilisation du vCPU (0 à 1).
 * @param {number} [year] Année à prendre en compte pour le calcul (ex. 2024).
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateCpuEmissions(
  provider,
  region,
  cpuCount,
  duration,
  averageVcpuUtilization = 0.5,
  year
) {
  try {
    const apiRegion = normalizeRegion(region); // j’applique la normalisation
    const body = {
      region: apiRegion,
      cpu_count: cpuCount,
      average_vcpu_utilization: averageVcpuUtilization,
      duration,
      duration_unit: "hour",
      ...(year !== undefined && { year }), // j’ajoute l’année si précisée
    };
    const response = await fetch(`${BASE_URL}/compute/v1/${provider}/cpu`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 7) Cloud Computing – Storage (compute/v1/:provider/storage)
/**
 * Calcule les émissions carbone liées au stockage dans le cloud.
 *
 * @param {string} provider Nom du fournisseur (aws, gcp, azure, etc.).
 * @param {string} region Région cloud (ex. "us-east-1").
 * @param {string} storageType Type de stockage (ssd, hdd, etc.).
 * @param {number} data Quantité de données stockées.
 * @param {number} duration Durée du stockage.
 * @param {string} [dataUnit="MB"] Unité des données (MB, GB, etc.).
 * @param {string} [durationUnit="hour"] Unité de durée (hour, day).
 * @param {number} [year] Année à prendre en compte pour le calcul.
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateStorageEmissions(
  provider,
  region,
  storageType,
  data,
  duration,
  dataUnit = "MB",
  durationUnit = "hour",
  year
) {
  try {
    const apiRegion = normalizeRegion(region);
    const body = {
      region: apiRegion,
      storage_type: storageType,
      data,
      data_unit: dataUnit,
      duration,
      duration_unit: durationUnit,
      ...(year !== undefined && { year }),
    };
    const response = await fetch(`${BASE_URL}/compute/v1/${provider}/storage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// 8) Cloud Computing – Memory (compute/v1/:provider/memory)
/**
 * Calcule les émissions carbone liées à l’utilisation de mémoire dans le cloud.
 *
 * @param {string} provider Nom du fournisseur (aws, gcp, azure, etc.).
 * @param {string} region Région cloud (ex. "ap-southeast-1").
 * @param {number} data Quantité de mémoire utilisée.
 * @param {number} duration Durée d’utilisation.
 * @param {string} [dataUnit="MB"] Unité des données (MB, GB).
 * @param {string} [durationUnit="hour"] Unité de durée (hour, day).
 * @param {number} [year] Année à prendre en compte pour le calcul.
 * @returns {Promise<object>} Réponse JSON de l’API contenant les émissions.
 * @throws {Error} En cas d’erreur HTTP ou de requête.
 */
export async function calculateMemoryEmissions(
  provider,
  region,
  data,
  duration,
  dataUnit = "MB",
  durationUnit = "hour",
  year
) {
  try {
    const apiRegion = normalizeRegion(region);
    const body = {
      region: apiRegion,
      data,
      data_unit: dataUnit,
      duration,
      duration_unit: durationUnit,
      ...(year !== undefined && { year }),
    };
    const response = await fetch(`${BASE_URL}/compute/v1/${provider}/memory`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}


// Recherche de facteurs d’émission
export async function searchEmissionFactors(query, filters = {}) {
  const params = new URLSearchParams({ query, ...filters });
  const response = await fetch(`${BASE_URL}/data/v1/search?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${CLIMATIQ_API_KEY}` },
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

// Récupère un facteur d’émission par son ID
export async function getEmissionFactorById(id) {
  const response = await fetch(`${BASE_URL}/data/v1/emission-factors/${id}`, {
    headers: { 'Authorization': `Bearer ${CLIMATIQ_API_KEY}` },
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

// Calcul générique pour activité personnalisée
export async function calculateCustomEmissions(activityId, parameters, dataVersion = 'latest') {
  const response = await fetch(`${BASE_URL}/data/v1/estimate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emission_factor: { activity_id: activityId, data_version: dataVersion },
      parameters
    }),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

// Batch estimate
export async function calculateBatchEmissions(requests) {
  const response = await fetch(`${BASE_URL}/data/v1/estimate/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests }),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

// Cloud: instance mixte (embodied + runtime)
export async function calculateInstanceEmissions(
  provider, instanceType, region, duration,
  averageVcpuUtilization = 0.5, year
) {
  const apiRegion = normalizeRegion(region);
  const payload = {
    instance_type: instanceType,
    region: apiRegion,
    duration,
    duration_unit: 'hour',
    average_vcpu_utilization: averageVcpuUtilization,
    ...(year && { year })
  };
  const response = await fetch(`${BASE_URL}/compute/v1/${provider}/instance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

// Energy (Scope 1 & 2)
/**
 * Calcule les émissions liées à la consommation électrique.
 * @param {number} consumption Quantité consommée.
 * @param {string} consumptionUnit Unité (kWh).
 * @param {string} [country] Code pays ISO.
 * @param {string} [region] Région interne.
 * @param {number} [year]
 */
export async function calculateElectricityEmissions(
  consumption, consumptionUnit, country, region, year
) {
  const payload = { consumption, consumption_unit: consumptionUnit };
  if (country) payload.country = country;
  if (region)  payload.region  = region;
  if (year)    payload.year    = year;
  const response = await fetch(`${BASE_URL}/energy/v1/electricity`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

/**
 * Calcule les émissions liées à la consommation de chaleur.
 */
export async function calculateHeatEmissions(
  consumption, consumptionUnit, country, region, year
) {
  const payload = { consumption, consumption_unit: consumptionUnit };
  if (country) payload.country = country;
  if (region)  payload.region  = region;
  if (year)    payload.year    = year;
  const response = await fetch(`${BASE_URL}/energy/v1/heat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}

/**
 * Calcule les émissions liées à la consommation de carburant.
 */
export async function calculateFuelEmissions(
  consumption, consumptionUnit, country, region, year
) {
  const payload = { consumption, consumption_unit: consumptionUnit };
  if (country) payload.country = country;
  if (region)  payload.region  = region;
  if (year)    payload.year    = year;
  const response = await fetch(`${BASE_URL}/energy/v1/fuel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status} – ${errBody}`);
  }
  return response.json();
}


/**
 * Récupère les régions disponibles pour un fournisseur cloud donné.
 *
 * @param {string} provider Nom du fournisseur (aws, gcp, azure).
 * @returns {Promise<Array>} Liste des régions disponibles.
 * @throws {Error} En cas d'erreur HTTP ou de requête.
 */
export async function getCloudRegions(provider) {
  try {
    const response = await fetch(`${BASE_URL}/compute/v1/${provider}/regions`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLIMATIQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`HTTP ${response.status} – ${errBody}`);
    }

    const data = await response.json();
    return data.regions || [];
  } catch (error) {
    console.warn(`Impossible de récupérer les régions pour ${provider}:`, error);
    // Fallback avec des régions statiques en cas d'erreur
    return getStaticRegions(provider);
  }
}

/**
 * Régions statiques de fallback si l'API ne répond pas.
 *
 * @param {string} provider Nom du fournisseur.
 * @returns {Array} Liste des régions par défaut.
 */
function getStaticRegions(provider) {
  const staticRegions = {
    aws: [
      { id: 'us-east-1', name: 'US East (N. Virginia)' },
      { id: 'us-west-1', name: 'US West (N. California)' },
      { id: 'us-west-2', name: 'US West (Oregon)' },
      { id: 'eu-west-1', name: 'EU (Ireland)' },
      { id: 'eu-central-1', name: 'EU (Frankfurt)' },
      { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
      { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' }
    ],
    gcp: [
      { id: 'us-central1', name: 'US Central (Iowa)' },
      { id: 'us-east1', name: 'US East (South Carolina)' },
      { id: 'us-west1', name: 'US West (Oregon)' },
      { id: 'europe-west1', name: 'Europe West (Belgium)' },
      { id: 'europe-west4', name: 'Europe West (Netherlands)' },
      { id: 'asia-southeast1', name: 'Asia Southeast (Singapore)' },
      { id: 'asia-east1', name: 'Asia East (Taiwan)' }
    ],
    azure: [
      { id: 'eastus', name: 'East US (Virginia)' },
      { id: 'westus', name: 'West US (California)' },
      { id: 'westus2', name: 'West US 2 (Washington)' },
      { id: 'westeurope', name: 'West Europe (Netherlands)' },
      { id: 'northeurope', name: 'North Europe (Ireland)' },
      { id: 'southeastasia', name: 'Southeast Asia (Singapore)' },
      { id: 'eastasia', name: 'East Asia (Hong Kong)' }
    ]
  };

  return staticRegions[provider] || [];
}
