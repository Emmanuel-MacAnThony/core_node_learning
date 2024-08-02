import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename } from "./utils.js";

function download(url, filename, cb) {
  console.log(`Downloading ${url}`);
  superagent.get(url).end((err, res) => {
    if (err) {
      return cb(err);
    }
    saveFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, req.text);
    });
  });
}

function getPageLinks(currentUrl, body) {
  return [];
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    // Remember Zalgo from chapter 3?
    return process.nextTick(cb);
  }
  const links = getPageLinks(currentUrl, body); // (1)
  if (links.length === 0) {
    return process.nextTick(cb);
  }
  function iterate(index) {
    if (index === links.length) {
      return cb();
    }
    spider(links[index], nesting - 1, function (err) {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }
  iterate(0); // (4)
}

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);

  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code != "ENOENT") {
        return cb(err);
      }

      // file does not exist, so lets download it
      download(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    // The file already exists, let's process the links
    spiderLinks(url, fileContent, nesting, cb);
  });
}

function spiderLinksv2(currentUrl, body, nesting, cb) {
  if (nesting == 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return cb(err);
    }
    if (++completed === links.length && !hasErrors) {
      return cb();
    }
  }
  links.forEach((link) => spider(link, nesting - 1, done));
}
