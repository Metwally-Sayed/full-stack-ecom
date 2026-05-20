export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function shortenId(id: string): string {
  return `#${id.slice(0, 6).toUpperCase()}`;
}
