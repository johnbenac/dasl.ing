
# dasl.ing

DASL — Data-Addressed Structures &amp; Links. Go read the spec at https://dasl.ing/!

## Developing

Be **particularly** careful not to edit the `.html` files but rather the `.src.html`
ones. Otherwise you'll overwrite yourself.

Two work on the site locally, run two commands in separate terminals:
* `npm run watch` will re-generate files on save to `.src.html` files
* `npm run dev` in a second terminal will open up a static server. The static server
  does not hot-reload, so you'll need to refresh the page to see changes.

Happy hacking!
