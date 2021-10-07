# nouns-image-server

This package is useful for serving PNGs and JPEGs from your
local machine over an HTTP server.

The API is:

```
GET /
Return a JSON blob that describes all the files 
in the base directory. Filtered for .png and .jp(e)g

GET /:filename
Read the file at the specified path and return the
provided path.
```

## Quickstart

1. Put images in `images/` (subdirectories are OK too)
2. `yarn`
3. `yarn start`
4. Access the API via http://localhost:3020

## Configuration

You can set the `PORT` environment variable to change
the port the HTTP server listens on.
