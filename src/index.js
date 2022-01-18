import { getRecipe, parseRecipe } from './scrape';

export default {
  async fetch(request) {
    console.log('-----------');
    const [, q] = new URLSearchParams(request.url).entries().next().value;
    const recipes = await parseRecipe(await getRecipe(q));
    return new Response(JSON.stringify(recipes), {
      headers: { 'content-type': 'application/json' },
    });
  },
};
