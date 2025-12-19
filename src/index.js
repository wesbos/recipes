import { getRecipe, parseRecipe } from './scrape';

export default {
  async fetch(request) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
    console.log('-----------');
    const recipes = await parseRecipe(await getRecipe(q || 'pizza'));
    return new Response(JSON.stringify({ results: recipes }), {
      headers: { 'content-type': 'application/json' },
    });
  },
};
