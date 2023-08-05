import { Entity } from '../interfaces/entity';
import { Paginator } from '../requests/pagination/paginator';

export function isEntity(obj: any): obj is Entity {
  return obj?.interface === 'Entity';
}

export function isPaginator(obj: any): obj is Paginator<any> {
  return obj?.interface === 'Paginator';
}
