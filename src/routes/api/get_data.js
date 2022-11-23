const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');
const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

// Gets an authenticated user's fragment data (i.e., raw binary data) with the given id.
module.exports = async (req, res) => {
  // return the path as the object
  // see https://nodejs.org/api/path.html
  const extension = path.extname(req.params.id); //returns fragment's extension
  const fragmentId = path.basename(req.params.id, extension); // returns fragmentId excluding the extension

  try {
    // get the metadata of the fragment, returned in buffer (raw data)
    let fragmentMetadata = await Fragment.byId(req.user, fragmentId);
    // get the data of the fragment
    let fragment = await fragmentMetadata.getData();

    // if no extension provided, replace header content type to fragment's content type
    // and response with original fragment data
    if (!extension) {
      res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
    } else if (extension) {
      // if extension provided,
      // server attempts to convert the fragment extension to the associated type

      // if the fragment's mimetype starts with text or is application/json and requested extension is .txt
      if (
        (fragmentMetadata.mimeType.startsWith('text/') && extension === '.txt') ||
        (fragmentMetadata.mimeType === 'application/json' && extension === '.txt')
      ) {
        fragmentMetadata.type = 'text/plain';
        res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
      } else if (
        // if the fragment's mimetype is text/markdown and requested extension is .md,
        // or mimetype is text/html and requested extension is .html,
        // or mimetype is application/json and requested extension is .json,
        (fragmentMetadata.mimeType === 'text/markdown' && extension === '.md') ||
        (fragmentMetadata.mimeType === 'text/html' && extension === '.html') ||
        (fragmentMetadata.mimeType === 'application/json' && extension === '.json')
      ) {
        res.set('Content-type', fragmentMetadata.mimeType).status(200).send(fragment);
      } else if (fragmentMetadata.mimeType === 'text/markdown' && extension === '.html') {
        // if the fragment's mimetype is text/markdown and requested extension is .html
        fragmentMetadata.type = 'text/html';
        res
          .set('Content-type', fragmentMetadata.mimeType)
          .status(200)
          .send(md.render(`${fragment}`));
      } else {
        throw new Error('The Extension is Unknown/Unsupported type!');
      }
    }
  } catch (Error) {
    // extension used is an unknown/unsupported type,
    // or the fragment cannot be converted to this type
    if (Error.message) {
      res.status(415).send(createErrorResponse(415, Error.message));
    } else {
      //id is an unknown fragment
      res.status(404).send(createErrorResponse(404, 'Unknown Fragment'));
    }
  }
};
