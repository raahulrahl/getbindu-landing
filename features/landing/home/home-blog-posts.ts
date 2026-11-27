import "server-only";

import { getAllPostCards } from "../blog/posts";
import { blogRow, type BlogRowPost } from "./content";

export function getHomeBlogPosts(): BlogRowPost[] {
  const cards = new Map(getAllPostCards().map((card) => [card.slug, card]));
  return blogRow.slugs.flatMap((slug) => {
    const card = cards.get(slug);
    if (!card) return [];
    return [{
      slug: card.slug,
      title: card.title,
      date: card.dateLabel,
      iso: card.date,
      category: card.category,
    }];
  });
}
