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
} from '../lib/climatiq.js';

// Vérification de la clé API
if (!process.env.VITE_CLIMATIQ_API_KEY) {
  console.error('VITE_CLIMATIQ_API_KEY non définie. Veuillez configurer votre .env');
  process.exit(1);
}
console.log('Clé API détectée (Node) :', process.env.VITE_CLIMATIQ_API_KEY);

/**
 * Exécute un test valide et vérifie la réponse.
 * @param {string} name Nom du test
 * @param {() => Promise<any>} fn Appel API à tester
 * @param {(res: any) => void} validate Fonction de validation de la réponse
 */
async function runTest(name, fn, validate) {
  try {
    const res = await fn();
    validate(res);
    console.log(`[OK] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name} :`, err.message || err);
  }
}

/**
 * Exécute un test d'erreur et vérifie qu'une exception est levée.
 * @param {string} name Nom du test
 * @param {() => Promise<any>} fn Appel API qui doit échouer
 * @param {string} expectedMessagePart Partie du message d'erreur attendue
 */
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

// Exécution des tests
(async () => {
  // Tests valides
  await runTest(
    'Vol CDG->MRS',
    () => calculateFlightEmissions('CDG', 'MRS'),
    res => {
      assert.ok(res.co2e > 0, 'co2e doit être supérieur à 0');
      assert.ok(Array.isArray(res.legs) && res.legs.length > 0, 'legs doit être un tableau non vide');
    }
  );

  await runTest(
    'Voiture 100 km medium',
    () => calculateCarEmissions(100, 'medium'),
    res => {
      assert.strictEqual(res.activity_data.activity_unit, 'km', 'Unité doit être "km"');
      assert.ok(res.co2e > 0, 'co2e doit être supérieur à 0');
    }
  );

  await runTest(
    'Train 200 km national',
    () => calculateTrainEmissions(200, 'national'),
    res => {
      assert.strictEqual(
        res.activity_data.activity_unit,
        'passenger-km',
        'Unité doit être "passenger-km"'
      );
      assert.ok(res.co2e > 0, 'co2e doit être supérieur à 0');
    }
  );

  await runTest(
    'Bus 20 km local',
    () => calculateBusEmissions(20, 'local'),
    res => {
      assert.strictEqual(
        res.emission_factor.id,
        '2246ac54-c55e-4b4c-9201-f23f934b18e2',
        'ID du facteur incorrect'
      );
      assert.ok(res.co2e >= 0, 'co2e doit être supérieur ou égal à 0');
    }
  );

  await runTest(
    'CPU AWS us-east-1 4 vCPU 2h 75%',
    () => calculateCpuEmissions('aws', 'us-east-1', 4, 2, 0.75),
    res => {
      assert.ok(res.emission_factor.id, 'ID du facteur doit être présent');
      assert.ok(res.co2e > 0, 'co2e doit être supérieur à 0');
    }
  );

  await runTest(
    'Storage GCP europe-west1 SSD 500GB 24h',
    () => calculateStorageEmissions('gcp', 'europe-west1', 'ssd', 500, 24, 'GB', 'hour'),
    res => {
      assert.strictEqual(
        res.activity_data.activity_unit,
        'kWh',
        'Unité doit être "kWh"'
      );
      assert.ok(res.co2e >= 0, 'co2e doit être supérieur ou égal à 0');
    }
  );

  await runTest(
    'Memory Azure westeurope 16GB 5h',
    () => calculateMemoryEmissions('azure', 'westeurope', 16, 5, 'GB', 'hour'),
    res => {
      assert.ok(res.emission_factor.id, 'ID du facteur doit être présent');
      assert.ok(res.co2e > 0, 'co2e doit être supérieur à 0');
    }
  );

  // Tests d'erreur
  await runErrorTest(
    'Vol codes invalides',
    () => calculateFlightEmissions('XXX', 'YYY'),
    'HTTP'
  );

  await runErrorTest(
    'Voiture type invalide',
    () => calculateCarEmissions(100, 'unknown'),
    'HTTP'
  );

  await runErrorTest(
    'CPU provider invalide',
    () => calculateCpuEmissions('invalid', 'us-east-1', 1, 1),
    'HTTP'
  );

  console.log('Exécution des tests terminée');
})();
