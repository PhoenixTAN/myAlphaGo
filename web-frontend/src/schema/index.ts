import Joi from "joi";
import { BOARD_WIDTH, BOARD_POSITION_STATE_ARRAY } from "@Constants/index";

export const commonRulesParamSchema = Joi.object({
  board: Joi.array()
    .items(
      Joi.array()
        .items(
          Joi.number()
            .valid(...BOARD_POSITION_STATE_ARRAY)
            .required()
        )
        .length(BOARD_WIDTH)
        .required()
    )
    .length(BOARD_WIDTH)
    .required(),
  x: Joi.number().integer().min(1).max(BOARD_WIDTH).required(),
  y: Joi.number().integer().min(1).max(BOARD_WIDTH).required(),
  color: Joi.number()
    .valid(...BOARD_POSITION_STATE_ARRAY)
    .required(),
});
