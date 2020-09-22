const mdLinks = require('../');
const path = require('path');
const axios = require('axios');

jest.mock('axios');


//Tests unitarios
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

  it('It should thrown a file error when the file doesnt exist', () => { //deberia retornar error cuando el archivo no existe
    return mdLinks('./iDontLikeTests.md').catch(error => {
      expect(error.code).toBe('ENOENT');
    });
  });

  it('It should thrown a file error when the file passed down is not a Markdown type', () => { //deberia retornar error cuando el archivo no tiene la extension .md 
    return mdLinks('./iDontLikeTests.txt').catch(error => {
      expect(error).toBe('File is not supported')
    });
  });

  it('It should return a 200 status when the link is OK', () => { //deberia retornar 200 cuando el link esta bien
    jest.spyOn(axios, 'get').mockImplementation(() => new Promise(resolve => resolve({
      status: 200
    })));

    const mockFilePath = path.resolve('./test/mockFile.md');

    return mdLinks(mockFilePath, { validate: true }).then(links => {
      expect(links.length).toBe(18);
      expect(links[0]).toEqual({
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: mockFilePath,
        status: 200,
        ok: true
      });
    });
  });

  it('It should return an error status when the link is broken', () => {
    jest.spyOn(axios, 'get').mockImplementation(() => new Promise((resolve, reject) => reject({
      response: {
        status: 401
      }
    })));

    const mockFilePath = path.resolve('./test/mockFile.md');

    return mdLinks(mockFilePath, { validate: true }).then(links => {
      expect(links.length).toBe(18);
      expect(links[0]).toEqual({
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: mockFilePath,
        status: 401,
        ok: false
      });
    });
  });

  it('It should return a 503 status when the link is broken and it has an unknown error', () => {
    jest.spyOn(axios, 'get').mockImplementation(() => new Promise((resolve, reject) => reject({
      request: {}
    })));

    const mockFilePath = path.resolve('./test/mockFile.md');

    return mdLinks(mockFilePath, { validate: true }).then(links => {
      expect(links.length).toBe(18);
      expect(links[0]).toEqual({
        href: 'https://es.wikipedia.org/wiki/Markdown',
        text: 'Markdown',
        file: mockFilePath,
        status: 503,
        ok: false
      });
    });
  });
});
