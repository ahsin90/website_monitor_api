export default class Pagination {
  limit: number;
  offset: number;

  constructor(limit: number, offset: number) {
    this.limit = limit ? limit : 0;
    this.offset = offset ? offset : 0;
  }

  page = (): any => {
    const limit: number = this.limit ? +this.limit : 10;
    const offset: number = this.offset ? this.offset : 0;
    return { limit, offset };
  };

  data = (data: any): object => {
    const page = this.page();
    const { count: totalItems, rows: rows } = data;
    const currentPage = page.offset ? +page.offset : 0;
    const totalPages = Math.ceil(totalItems / page.limit);

    return { totalItems, rows, totalPages, currentPage };
  };
}
