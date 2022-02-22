import { getRecipe, parseRecipe } from './scrape';

export default {
  async fetch(request) {
    console.log('-----------');
    const [, q] = new URLSearchParams(request.url).entries().next().value;
    const recipes = await parseRecipe(await getRecipe(q));
    console.log(recipes);
    return new Response(JSON.stringify({ results: recipes }), {
      headers: { 'content-type': 'application/json' },
    });
  },
};
