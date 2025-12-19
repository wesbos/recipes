import { parseHTML } from 'linkedom/worker';

const url = `https://www.allrecipes.com/search`;

const cache = new Map();

function getCleanTextContent(element) {
  return element.textContent.replace('\n', '').trim();
}

const enableCache = true;

export async function getRecipe(query = 'pizza') {
  console.log(`Searching for ${query}`);
  // Check for cache
  if (enableCache && cache.has(query)) {
    console.log('We already have that one');
    return cache.get(query).html;
  }
  const response = await fetch(`${url}?q=${query}`);
  const data = await response.text();
  if (enableCache) {
    cache.set(query, data);
  }
  return data;
}

export function parseRecipe(htmlString) {
  const { document } = parseHTML(`<!DOCTYPE html>${htmlString}`);
  const cards = document.querySelectorAll('a[data-doc-id]');
  const recipes = Array.from(cards).map((card) => {
    const img = card.querySelector('img');
    const description = img.alt;
    const fullStars = card.querySelectorAll('.icon-star').length;
    const halfStars = card.querySelectorAll('.icon-star-half').length;
    const rating = (fullStars + halfStars / 2).toFixed(1);
    const recipe = {
      title: getCleanTextContent(card.querySelector('.card__title')),
      ingredients: description, // todo
      rating,
      description,
      thumbnail: img.dataset.src,
      href: card.href,
    };
    return recipe;
  });
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
