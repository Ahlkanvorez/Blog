import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class NoEncodeUrlSerializer implements UrlSerializer {
  parse (url: any): UrlTree {
    return new DefaultUrlSerializer().parse(url);
  }

  serialize(tree: UrlTree): any {
    const newUrl = decodeURI(new DefaultUrlSerializer().serialize(tree));
    console.log(newUrl);
    // decoding ensures that no portion of the resulting url is encoded.
    return newUrl;
  }
}
