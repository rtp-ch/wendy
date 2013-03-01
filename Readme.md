# Wendy

- Wendy optimizes your CSS by inlining images into a dataurl
- She also converts your px unit values into rem and provides a fallback


## Installation

```bash
$ sudo npm install -g wendy
```

## Usage

## Command line

You can use wendy from the command line:

```bash
$ wendy your-file.css
```

Wendy has various options. Check them out with -h:
```
$ wendy -h

  Usage: wendy [options] <file>

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -p, --basePath [path]           set the base path to inline images
    -t, --mimeTypes [mimetypes]     comma separated mimetypes, regexp allowed
    -m, --maxDataUrlSize [size]     maximum in bytes or 32kb, 2mb, 3gb
    -b, --baseFontSize [font-size]  set the base font size
    -v, --verbose                   adds verbose output to error log
    -o, --out [file]                write the output to a file
```


## Use the rework plugins

Wendy is powered by [Rework](https://github.com/visionmedia/rework). Her Plugins can be used in Javascript.

```Javascript
var wendy = require('wendy'),
    rework = require('rework'),

    inlineOptions = {
        basePath:       'css/',
        mimeTypes:      ['image/png', 'image/jpg', 'image/gif'],
        maxSize:        1024 * 32,
    },

    remifyOptions = {
        baseFontSize: 16
    };

// all options except for basePath are optional
var css = rework(yourCss)
  .use(wendy.inline(inlineOptions))
  .use(wendy.remify(remifyOptions))
  .toString()
```

