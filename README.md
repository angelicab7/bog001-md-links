# Markdown Links

<img src='./src/img/Md-links.svg'>


## 1. Overview

[Markdown](https://en.wikipedia.org/wiki/Markdown) is a lightweight markup language widely used by developers. It’s prevalent on many platforms that handle plain text (GitHub, forums, blogs, etc.) and is commonly found in repositories, starting with the traditional `README.md` file.

Markdown files often contain links that may be broken or outdated, diminishing the value of the shared information.

This tool reads and analyzes Markdown files to verify the links they contain and generate useful statistics.

----------

## 2. Installing

To install the CLI tool globally, run the following command:

`$ npm install -g @angelicab7/md-links` 

## 3. CLI Usage

The tool accepts a `.md` file or a directory containing `.md` files as an argument.

-   Running the command will return an array of objects, each containing the link's URL, its reference text, and the file where it was found:

`$ md-links ./README.md` 

Output:

`{
  href: 'https://en.wikipedia.org/wiki/Markdown',
  text: 'Markdown',
  file: '/path/to/README.md'
}` 

-   Use the `--validate` flag to check the status of each link:

`$ md-links ./README.md --validate` 

Output:

`{
  href: 'https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback',
  text: 'Read a File',
  file: '/path/to/README.md',
  status: 200,
  ok: true
}` 

-   Use the `--stats` flag to display the total number of links and how many are unique:

`$ md-links ./README.md --stats` 

Output:

`{ total: 51, unique: 46 }` 

-   Combine `--validate` and `--stats` to get the total, unique, and broken links:

`$ md-links ./README.md --stats --validate` 

Output:

`{ total: 51, unique: 46, broken: 1 }` 

----------

## 4. API Usage

-   To analyze a Markdown file and retrieve an array of objects containing links and their corresponding files:

```javascript
const mdlinks = require('@angelicab7/md-links');

mdlinks('./README.md')
  .then((res) => {
    console.log(res);
  });
```

-   To validate the status of each link in addition to fetching their details:

```javascript
mdlinks('./README.md', { validate: true })
  .then((res) => {
    console.log(res);
  });
```

-   To retrieve link statistics (total and unique):

```javascript
mdlinks('./README.md', { stats: true })
  .then((res) => {
    console.log(res);
  });
```

-   To retrieve both validation and statistics, including broken links:

```javascript
mdlinks('./README.md', { validate: true, stats: true })
  .then((res) => {
    console.log(res);
  });
```
