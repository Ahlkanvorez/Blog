import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';

export class NoEncodeUrlSerializer implements DefaultUrlSerializer {
  parse (url: any): UrlTree {
    return new DefaultUrlSerializer().parse(url);
  }

  serialize(tree: UrlTree): any {
    // decoding ensures that no portion of the resulting url is encoded.
    return decodeURI(new DefaultUrlSerializer().serialize(tree));
  }
}
