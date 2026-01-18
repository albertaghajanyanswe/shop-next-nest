import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type FilterValue = string | number | boolean | Array<string | number>;
export interface iSort {
  field: string;
  order: 'asc' | 'desc' | '';
}

export interface iFilter {
  [key: string]: any;
}

export interface iSearch {
  value: string;
  fields: string[];
}

export interface iFilterParams {
  params: {
    sort: iSort;
    filter: iFilter;
    limit: number;
    skip: number;
    search?: iSearch;
  };
}

@Injectable()
export class QueryPayloadBuilderService {
  private safeJsonParser(params: string) {
    try {
      const { limit, skip, sort, filter, search } = JSON.parse(params);
      return { limit, skip, sort, filter, search };
    } catch (err) {
      console.log('\n\n safeJsonParser err - ', err);
      return {
        limit: null,
        skip: null,
        sort: null,
        filter: null,
        search: null,
      };
    }
  }

  private buildNestedSort(field: string, order: 'asc' | 'desc') {
    const parts = field.split('_');
    const last = parts.pop()!;

    return parts
      .reverse()
      .reduce<
        Record<string, any>
      >((acc, curr) => ({ [curr]: acc }), { [last]: order });
  }

  /**
   * Построение вложенного where для relation и обычных полей
   * key: product_category_name_eq
   */
  private buildNestedWhere(
    key: string,
    value: FilterValue,
    operator = 'equals',
  ): any {
    const parts = key.split('_');
    const lastPart = parts.pop()!; // eq, in, contains, gte, lte
    let prismaOperator: string;

    switch (lastPart) {
      case 'eq':
        prismaOperator = 'equals';
        break;
      case 'in':
        prismaOperator = 'in';
        break;
      case 'contains':
        prismaOperator = 'contains';
        break;
      case 'startsWith':
        prismaOperator = 'startsWith';
        break;
      case 'gte':
        prismaOperator = 'gte';
        break;
      case 'lte':
        prismaOperator = 'lte';
        break;
      default:
        // lastPart — это реальное поле
        parts.push(lastPart);
        prismaOperator = operator;
        break;
    }

    const field = parts.join('_'); // например "price"

    // Числовые операторы → приводим к числу
    const resolvedValue = ['lte', 'gte'].includes(prismaOperator)
      ? Number(value)
      : value;

    if (Array.isArray(value) && prismaOperator !== 'in') prismaOperator = 'in';
    // Возвращаем объект в виде:
    // { price: { gte: 10 } }
    return {
      [field]: {
        [prismaOperator]: resolvedValue,
      },
    };
  }

  /**
   * Generic builder для любой модели Prisma
   */
  build({
    queryParams,
    userId,
    storeId,
  }: {
    queryParams: string;
    userId?: string;
    storeId?: string;
  }): any {
    const where: Record<string, any> = {};

    if (userId) where.userId = userId;
    if (storeId) where.storeId = storeId;

    if (!queryParams) return { where };
    const { sort, filter, limit, skip, search } =
      this.safeJsonParser(queryParams);

    // фильтры
    if (filter) {
      for (const key in filter) {
        const value = filter[key];
        const nested = this.buildNestedWhere(key, value);

        for (const field in nested) {
          if (!where[field]) where[field] = {};
          Object.assign(where[field], nested[field]);
        }
      }
    }

    // поиск
    if (search && search.value && search.fields.length) {
      where.OR = search.fields.map((field) => ({
        [field]: { contains: search.value, mode: 'insensitive' },
      }));
    }

    // сортировка
    let orderBy;

    if (sort && sort.field) {
      const order = sort.order === 'desc' ? 'desc' : 'asc';

      if (sort.field.includes('_')) {
        orderBy = this.buildNestedSort(sort.field, order);
      } else {
        orderBy = { [sort.field]: order };
      }
    }
    console.log('QUERY - PAYLOAD - ', {
      where,
      ...(limit && { take: +limit }),
      ...(skip ? { skip: +skip } : { skip: 0 }),
      ...(orderBy && { orderBy }),
    });
    return {
      where,
      ...(limit && { take: +limit }),
      ...(skip ? { skip: +skip } : { skip: 0 }),
      ...(orderBy && { orderBy }),
    };
  }
}

// import { Injectable } from '@nestjs/common';
// import { Prisma } from '@prisma/client';

// type FilterValue = string | number | boolean | Array<string | number>;
// export interface iSort {
//   field: string;
//   order: 'asc' | 'desc' | '';
// }

// export interface iFilter {
//   [key: string]: any;
// }

// export interface iSearch {
//   value: string;
//   fields: string[];
// }

// export interface iFilterParams {
//   params: {
//     sort: iSort;
//     filter: iFilter;
//     limit: number;
//     skip: number;
//     search?: iSearch;
//   };
// }

// @Injectable()
// export class QueryPayloadBuilderService {
//   private safeJsonParser(params: string) {
//     try {
//       const { limit, skip, sort, filter, search } = JSON.parse(params);
//       return { limit, skip, sort, filter, search };
//     } catch (err) {
//       console.log('\n\n safeJsonParser err ', err);
//       return {
//         limit: null,
//         skip: null,
//         sort: null,
//         filter: null,
//         search: null,
//       };
//     }
//   }

//   private buildNestedSort(field: string, order: 'asc' | 'desc') {
//     const parts = field.split('_');
//     const last = parts.pop()!;

//     return parts
//       .reverse()
//       .reduce<
//         Record<string, any>
//       >((acc, curr) => ({ [curr]: acc }), { [last]: order });
//   }

//   /**
//    * Построение вложенного where для relation и обычных полей
//    * key: product_category_name_eq
//    */
//   private buildNestedWhere(
//     key: string,
//     value: FilterValue,
//     operator = 'equals',
//   ): any {
//     const parts = key.split('_');
//     const lastPart = parts.pop()!; // например eq, in, contains
//     let prismaOperator: string;

//     switch (lastPart) {
//       case 'eq':
//         prismaOperator = 'equals';
//         break;
//       case 'in':
//         prismaOperator = 'in';
//         break;
//       case 'contains':
//         prismaOperator = 'contains';
//         break;
//       case 'startsWith':
//         prismaOperator = 'startsWith';
//         break;
//       case 'gte':
//         prismaOperator = 'gte';
//         break;
//       case 'lte':
//         prismaOperator = 'lte';
//         break;
//       default:
//         // если оператор не указан, считаем что lastPart это поле
//         parts.push(lastPart);
//         prismaOperator = operator;
//         break;
//     }

//     // если value массив и оператор не in → превращаем в in
//     if (Array.isArray(value) && prismaOperator !== 'in') prismaOperator = 'in';

//     // указываем тип any для TS
//     const nested = parts
//       .reverse()
//       .reduce<
//         Record<string, any>
//       >((acc, curr) => ({ [curr]: acc }), { [prismaOperator]: value });

//     return nested;
//   }

//   /**
//    * Generic builder для любой модели Prisma
//    */
//   build({
//     queryParams,
//     userId,
//     storeId,
//   }: {
//     queryParams: string;
//     userId?: string;
//     storeId?: string;
//   }): any {
//     const where: Record<string, any> = {};

//     if (userId) where.userId = userId;
//     if (storeId) where.storeId = storeId;

//     console.log('QUERY = ', queryParams);
//     if (!queryParams) return { where };
//     const { sort, filter, limit, skip, search } =
//       this.safeJsonParser(queryParams);
//     console.log('build query payload = ', {
//       sort,
//       filter,
//       limit,
//       skip,
//       search,
//     });

//     // фильтры
//     if (filter) {
//       for (const key in filter) {
//         const value = filter[key];
//         Object.assign(where, this.buildNestedWhere(key, value));
//       }
//     }

//     // поиск
//     if (search && search.value && search.fields.length) {
//       where.OR = search.fields.map((field) => ({
//         [field]: { contains: search.value, mode: 'insensitive' },
//       }));
//     }

//     // сортировка
//     let orderBy;

//     if (sort && sort.field) {
//       const order = sort.order === 'desc' ? 'desc' : 'asc';

//       if (sort.field.includes('_')) {
//         orderBy = this.buildNestedSort(sort.field, order);
//       } else {
//         orderBy = { [sort.field]: order };
//       }
//     }
//     console.log('PAYLOAD - ', {
//       where,
//       ...(limit && { take: +limit }),
//       ...(skip ? { skip: +skip } : { skip: 0 }),
//       ...(orderBy && { orderBy }),
//     });
//     return {
//       where,
//       ...(limit && { take: +limit }),
//       ...(skip ? { skip: +skip } : { skip: 0 }),
//       ...(orderBy && { orderBy }),
//     };
//   }
// }
