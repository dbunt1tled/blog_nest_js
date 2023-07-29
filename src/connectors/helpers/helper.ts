export function isEntity(obj: any): boolean {
  return 'interface' in obj && obj.interface === 'Entity';
}
export function isPaginator(obj: any): boolean {
  return 'interface' in obj && obj.interface === 'Paginator';
}