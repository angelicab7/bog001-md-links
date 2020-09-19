const mdLinks = require('../');
const path = require('path');


describe('mdLinks', () => {
  it('It should read a Markdown file and extract the links from it', () => {
    const mockFilePath = path.resolve('./test/mockFile.md');

    return mdLinks(mockFilePath).then(links => {
      expect(links.length).toBe(18);
      expect(links[0]).toEqual({
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: mockFilePath
      });
    });
  });

  it('It should thrown a file error when the file doesnt exist', () => {
    return mdLinks('./iDontLikeTests.md').catch(error => {
      expect(error.code).toBe('ENOENT');
    });
  });
});
