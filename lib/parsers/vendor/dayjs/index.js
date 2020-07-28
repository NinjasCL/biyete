/*
We did this instead of importing from npm
because it will generate an easier to use code
with micronbundler. Avoid polluting main function context.
https://github.com/iamkun/dayjs
*/

import dayjs from './day';
import customParseFormat from './plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default dayjs;
