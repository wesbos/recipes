import { getRecipe } from './scrape';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const html = await getRecipe('pizza');
  return new Response(html, {
    headers: { 'content-type': 'text/plain' },
  });
}
