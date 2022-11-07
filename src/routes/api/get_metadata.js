const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('node:path');

/**
 * Get metadata of the fragment by its passed id (GET /fragments/:id/info)
 */
module.exports = async (req, res) => {
  try {
    const convertExt = path.extname(req.params.id); // get the extension
    const fragmentId = path.basename(req.params.id, convertExt); // get the fragment ID

    if (fragmentId) {
      const fragment = await Fragment.byId(req.user, req.params.id);
      res.status(200).send(createSuccessResponse({ fragment: fragment }));
    }
  } catch (err) {
    res.status(404).send(createErrorResponse(404, err));
  }
};
