export class FilterableComponent<T> {
  filtered: Array<T>;
  searchFilter: string;

  isMatch(prop: any, keyword: string) {
    const propType = typeof prop;
    if (propType === 'object') {
      prop = JSON.stringify(prop);
    } else if (propType !== 'string') {
      prop = prop.toString();
    }
    return prop.toLowerCase().indexOf(keyword) >= 0;
  }
}
