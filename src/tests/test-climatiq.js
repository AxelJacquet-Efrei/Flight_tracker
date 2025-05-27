// src/tests/test-climatiq.js

import 'dotenv/config';
import assert from 'assert';
import {
  calculateFlightEmissions,
  calculateCarEmissions,
  calculateTrainEmissions,
  calculateBusEmissions,
  calculateCpuEmissions,
  calculateStorageEmissions,
  calculateMemoryEmissions,
  searchEmissionFactors,
  getEmissionFactorById,
  calculateCustomEmissions,
  calculateBatchEmissions,
  calculateInstanceEmissions,
  calculateElectricityEmissions,
  calculateHeatEmissions,
  calculateFuelEmissions
} from '../lib/climatiq.js';

// Vérification de la clé API
if (!process.env.VITE_CLIMATIQ_API_KEY) {
  console.error('VITE_CLIMATIQ_API_KEY non définie. Veuillez configurer votre .env');
  process.exit(1);
}
console.log('Clé API détectée (Node) :', process.env.VITE_CLIMATIQ_API_KEY);

/** Execute un test valide */
async function runTest(name, fn, validate) {
  try {
    const res = await fn();
    validate(res);
    console.log(`[OK] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name} :`, err.message || err);
  }
}

/** Execute un test d'erreur attendu */
async function runErrorTest(name, fn, expectedMessagePart) {
  try {
    await fn();
    console.error(`[FAIL] ${name} : aucune erreur levée`);
  } catch (err) {
    assert.ok(
      err.message.includes(expectedMessagePart),
      `${name} : le message d'erreur doit contenir "${expectedMessagePart}"`
    );
    console.log(`[OK] ${name} (cas d'erreur)`);
  }
}

(async () => {
  // Tests valides existants
  await runTest('Vol CDG->MRS', () => calculateFlightEmissions('CDG', 'MRS'), res => {
    assert.ok(res.co2e > 0);
    assert.ok(Array.isArray(res.legs) && res.legs.length > 0);
  });

  await runTest('Voiture 100 km medium', () => calculateCarEmissions(100, 'medium'), res => {
    assert.strictEqual(res.activity_data.activity_unit, 'km');
  });

  await runTest('Train 200 km national', () => calculateTrainEmissions(200, 'national'), res => {
    assert.strictEqual(res.activity_data.activity_unit, 'passenger-km');
  });

  await runTest('Bus 20 km local', () => calculateBusEmissions(20, 'local'), res => {
    assert.strictEqual(res.emission_factor.id, '2246ac54-c55e-4b4c-9201-f23f934b18e2');
  });

  await runTest('CPU AWS us-east-1 4 vCPU 2h 75%', () => calculateCpuEmissions('aws', 'us-east-1', 4, 2, 0.75), res => {
    assert.ok(res.emission_factor.id);
  });

  await runTest('Storage GCP europe-west1 SSD 500GB 24h', () => calculateStorageEmissions('gcp', 'europe-west1', 'ssd', 500, 24, 'GB', 'hour'), res => {
    assert.strictEqual(res.activity_data.activity_unit, 'kWh');
  });

  await runTest('Memory Azure westeurope 16GB 5h', () => calculateMemoryEmissions('azure', 'westeurope', 16, 5, 'GB', 'hour'), res => {
    assert.ok(res.emission_factor.id);
  });

  // Nouveaux tests (erreurs attendues)
  await runErrorTest('Recherche facteur car (missing data_version)', () => searchEmissionFactors('car'), 'missing field');
  await runErrorTest('Détail facteur par ID (404)', () => getEmissionFactorById('invalid'), 'HTTP 404');
  await runErrorTest('Custom emissions 50 km (bad data_version)', () => calculateCustomEmissions('invalid-id', { distance: 50, distance_unit: 'km' }, 'latest'), 'not recognized');
  await runErrorTest('Batch emissions (invalid payload)', () => calculateBatchEmissions([{ foo: 'bar' }]), 'invalid type');
  await runErrorTest('Instance AWS t3.micro 1h (unknown field)', () => calculateInstanceEmissions('aws', 't3.micro', 'us-east-1', 1), 'unknown field');
  await runErrorTest('Electricité FR 100kWh (unknown field)', () => calculateElectricityEmissions(100, 'kWh', 'FR'), 'unknown field');
  await runErrorTest('Chaleur FR 50kWh (unknown field)', () => calculateHeatEmissions(50, 'kWh', 'FR'), 'unknown field');
  await runErrorTest('Carburant US 10L (missing amount)', () => calculateFuelEmissions(10, 'L', 'US'), 'missing field');

  // Tests d'erreur existants
  await runErrorTest('Vol codes invalides', () => calculateFlightEmissions('XXX', 'YYY'), 'HTTP');
  await runErrorTest('Voiture type invalide', () => calculateCarEmissions(100, 'unknown'), 'HTTP');
  await runErrorTest('CPU provider invalide', () => calculateCpuEmissions('invalid', 'us-east-1', 1, 1), 'HTTP');

  console.log('Exécution des tests terminée');
})();
