const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let fragment;
  const api = process.env.API_URL;

  if (!Fragment.isSupportedType(req.get('Content-Type'))) {
    res.status(415).json(createErrorResponse(415, 'Content-Type is not supported'));
  } else {
    try {
      fragment = new Fragment({
        ownerId: req.user,
        type: 'text/plain', //req.get('Content-Type'),
        size: req.body.length,
      });
      await fragment.save();
      await fragment.setData(req.body);
      res.location(`${api}/v1/fragments/${fragment.id}`);
      res.status(201).json(createSuccessResponse({ fragment }));
      logger.info({ fragment: fragment }, `Fragment have been posted successfully`);
    } catch (err) {
      res.status(404).json(createErrorResponse(404, 'Unable to POST the fragment'));
    }
  }
};
