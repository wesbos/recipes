import { parseHTML } from 'linkedom/worker';

const url = `https://www.allrecipes.com/element-api/content-proxy/faceted-searches-submit`;

const cache = new Map();

function getCleanTextContent(element) {
  return element.textContent.replace('\n', '').trim();
}

export async function getRecipe(query = 'pizza') {
  console.log(`Searching for ${query}`);
  // Check for cache
  if (cache.has(query)) {
    console.log('We already have that one');
    return cache.get(query).html;
  }
  const data = await fetch(`${url}?search=${query}`).then((res) => res.json());
  cache.set(query, data);
  return data.html;
}

export function parseRecipe(htmlString) {
  const { document } = parseHTML(`<!DOCTYPE html>${htmlString}`);
  const cards = document.querySelectorAll('.card');
  const recipes = Array.from(cards).map((card) => {
    const description = getCleanTextContent(
      card.querySelector('.card__summary')
    );
    const recipe = {
      title: getCleanTextContent(card.querySelector('h3')),
      ingredients: description,
      rating: parseFloat(card.querySelector('[data-rating]').dataset.rating),
      description,
      thumbnail: `${card.querySelector('img').src}?width=300`,
      href: card.querySelector('a').href,
    };
    return recipe;
  });
  // console.log(document);
  console.log('', recipes.length);
  return recipes;
}

async function test() {
  await parseRecipe(await getRecipe('clams'));
  await parseRecipe(await getRecipe('pizza'));
  await parseRecipe(await getRecipe('clams'));
  await parseRecipe(await getRecipe('beer'));
  await parseRecipe(await getRecipe('pizza'));
}

// test();
