const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get metadata of the fragment by its passed id (GET /fragments/:id/info)
 */

let fragment;
module.exports = async (req, res) => {
  try {
    fragment = await Fragment.byId(req.user, req.params.id);

    res.status(200).json(fragment);
    logger.info({ fragmentInfo: fragment }, `Fragment's metadata has been retrieved successfully`);
  } catch (err) {
    res
      .status(404)
      .json(createErrorResponse(404, 'Metadata of the fragment with such ID is not found'));
  }
};
