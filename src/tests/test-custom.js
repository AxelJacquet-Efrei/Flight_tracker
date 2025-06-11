import { searchEmissionFactors, calculateCustomEmissions, getEmissionFactorById } from '../lib/climatiq.js';

async function testCustomEmissions() {
  try {
    console.log('1. Test de recherche de facteurs d\'émission pour "electricity"');
    const searchResults = await searchEmissionFactors('electricity', {
      results_per_page: 5
    });
    console.log('Résultats de recherche:', JSON.stringify(searchResults, null, 2));

    if (searchResults.results && searchResults.results.length > 0) {
      const factor = searchResults.results[0];
      console.log('\n2. Test de calcul avec le premier facteur trouvé');
      const calculationResult = await calculateCustomEmissions(
        factor.activity_id,
        { [factor.unit_type]: 100 }
      );
      console.log('Résultat du calcul:', JSON.stringify(calculationResult, null, 2));

      console.log('\n3. Test de récupération des détails du facteur');
      const factorDetails = await getEmissionFactorById(factor.activity_id);
      console.log('Détails du facteur:', JSON.stringify(factorDetails, null, 2));
    }
  } catch (error) {
    console.error('Erreur lors des tests:', error);
  }
}

console.log('Démarrage des tests des fonctions personnalisées...\n');
testCustomEmissions();
