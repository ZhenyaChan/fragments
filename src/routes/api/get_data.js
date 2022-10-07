const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');

// Gets an authenticated user's fragment data (i.e., raw binary data) with the given id.
let fragment, fragmentMetadata;
module.exports = async (req, res) => {
  // return the path as the object
  // see https://nodejs.org/api/path.html
  let query = path.parse(req.params.id);
  // remove the extension
  let extension = query.ext.split('.').pop();
  try {
    fragmentMetadata = await Fragment.byId(req.user, query.name);
    fragment = await fragmentMetadata.getData();
    // if no optional extension provided
    if (query.extension == '' || fragmentMetadata.type.endsWith(extension)) {
      res.setHeader('Content-type', fragmentMetadata.type);
      res.status(200).send(Buffer.from(fragment));
      logger.info(
        { fragmentData: fragment, contentType: fragmentMetadata.type },
        `Fragment Data received successfully!`
      );
    } else {
      // server attempts to convert the fragment extension to the associated type
      // TODO: fix the scope...
      try {
        if (fragmentMetadata.isText) {
          res.setHeader('Content-type', 'text/plain');
          res.status(200).send(Buffer.from(fragment));
          logger.info(
            { targetType: extension },
            `Extension is converted successfully to ${extension}`
          );
        }
        // unknown/unsupported extension type
      } catch (err) {
        res
          .status(415)
          .json(createErrorResponse(415, `Fragment cannot be returned as a ${extension}`));
      }
    }
    // id is unknown fragment
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Unknown Fragment'));
  }
};
